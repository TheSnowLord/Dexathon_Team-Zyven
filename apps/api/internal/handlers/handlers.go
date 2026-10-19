package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/matching"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type APIResponse struct {
	Data  interface{} `json:"data"`
	Error interface{} `json:"error"`
}

type APIError struct {
	Message string `json:"message"`
}

func Success(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Data:  data,
		Error: nil,
	})
}

func Error(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(APIResponse{
		Data: nil,
		Error: APIError{
			Message: message,
		},
	})
}

type Handler struct {
	DB *sql.DB
}

func NewHandler(db *sql.DB) *Handler {
	return &Handler{DB: db}
}

// ---------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------

func (h *Handler) UpsertProfile(c *fiber.Ctx) error {
	var p models.Profile
	if err := c.BodyParser(&p); err != nil {
		return Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if p.ID == "" {
		p.ID = "prof-" + uuid.NewString()[:8]
	}
	if p.Branch == "" || p.Year <= 0 {
		return Error(c, fiber.StatusBadRequest, "Branch and valid Year are required")
	}

	skillsJSON, _ := json.Marshal(p.Skills)
	now := time.Now().UTC().Format(time.RFC3339)

	query := `
		INSERT INTO profiles (id, branch, year, skills, location, remote_ok, budget_cap, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			branch = excluded.branch,
			year = excluded.year,
			skills = excluded.skills,
			location = excluded.location,
			remote_ok = excluded.remote_ok,
			budget_cap = excluded.budget_cap,
			updated_at = excluded.updated_at
	`
	_, err := h.DB.Exec(query, p.ID, p.Branch, p.Year, string(skillsJSON), p.Location, p.RemoteOK, p.BudgetCap, now, now)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to persist profile: "+err.Error())
	}

	// Also ensure reminder settings record exists (default opt-out)
	_, _ = h.DB.Exec(`
		INSERT OR IGNORE INTO reminder_settings (profile_id, opted_in, quiet_hours_start, quiet_hours_end, cadence)
		VALUES (?, 0, '22:00', '08:00', 'per_deadline')
	`, p.ID)

	p.UpdatedAt = now
	return Success(c, p)
}

func (h *Handler) GetProfile(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return Error(c, fiber.StatusBadRequest, "Missing profile ID")
	}

	var p models.Profile
	var skillsStr string
	query := `SELECT id, branch, year, skills, location, remote_ok, budget_cap, created_at, updated_at FROM profiles WHERE id = ?`
	err := h.DB.QueryRow(query, id).Scan(
		&p.ID, &p.Branch, &p.Year, &skillsStr, &p.Location, &p.RemoteOK, &p.BudgetCap, &p.CreatedAt, &p.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return Error(c, fiber.StatusNotFound, "Profile not found")
	} else if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Database error: "+err.Error())
	}

	_ = json.Unmarshal([]byte(skillsStr), &p.Skills)
	return Success(c, p)
}

// DeleteProfile provides genuine, total data deletion for trust guardrails.
func (h *Handler) DeleteProfile(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return Error(c, fiber.StatusBadRequest, "Missing profile ID")
	}

	tx, err := h.DB.Begin()
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to start transaction")
	}
	defer tx.Rollback()

	if _, err := tx.Exec("DELETE FROM reminder_settings WHERE profile_id = ?", id); err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to delete reminder settings")
	}
	if _, err := tx.Exec("DELETE FROM plan_items WHERE profile_id = ?", id); err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to delete saved plans")
	}
	res, err := tx.Exec("DELETE FROM profiles WHERE id = ?", id)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to delete profile: "+err.Error())
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return Error(c, fiber.StatusNotFound, "Profile not found")
	}

	if err := tx.Commit(); err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to commit deletion")
	}

	return Success(c, fiber.Map{
		"deleted":    true,
		"profile_id": id,
		"message":    "All student profile, plan items, and reminder data successfully deleted",
	})
}

// ---------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------

func (h *Handler) ListOpportunities(c *fiber.Ctx) error {
	branch := c.Query("branch")
	yearStr := c.Query("year")
	skill := c.Query("skill")
	location := c.Query("location")
	remoteStr := c.Query("remote")
	maxCostStr := c.Query("maxCost")
	category := c.Query("category")
	profileID := c.Query("profileId")

	// Pre-fetch student profile if profileId given, to compute real-time match badges
	var profile *models.Profile
	if profileID != "" {
		p, err := h.fetchProfileInternal(profileID)
		if err == nil {
			profile = p
		}
	}

	rows, err := h.DB.Query(`
		SELECT id, title, theme, category, branches, min_year, max_year,
		       skills_tags, location, is_remote, cost, deadline,
		       source_url, last_updated, eligibility_raw
		FROM opportunities
		ORDER BY deadline ASC
	`)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Database error: "+err.Error())
	}
	defer rows.Close()

	type OpportunityWithMatch struct {
		models.Opportunity
		Match models.MatchResult `json:"match"`
	}

	var results []OpportunityWithMatch

	for rows.Next() {
		var o models.Opportunity
		var branchesJSON, skillsJSON, eligibilityJSON string

		err := rows.Scan(
			&o.ID, &o.Title, &o.Theme, &o.Category, &branchesJSON, &o.MinYear, &o.MaxYear,
			&skillsJSON, &o.Location, &o.IsRemote, &o.Cost, &o.Deadline,
			&o.SourceURL, &o.LastUpdated, &eligibilityJSON,
		)
		if err != nil {
			continue
		}

		_ = json.Unmarshal([]byte(branchesJSON), &o.Branches)
		_ = json.Unmarshal([]byte(skillsJSON), &o.SkillsTags)
		_ = json.Unmarshal([]byte(eligibilityJSON), &o.EligibilityRaw)

		// Apply in-memory filtering for query params
		if category != "" && !strings.EqualFold(o.Category, category) {
			continue
		}
		if branch != "" && len(o.Branches) > 0 {
			matched := false
			for _, b := range o.Branches {
				if strings.EqualFold(b, branch) {
					matched = true
					break
				}
			}
			if !matched {
				continue
			}
		}
		if yearStr != "" {
			if yr, err := strconv.Atoi(yearStr); err == nil && yr > 0 {
				if (o.MinYear > 0 && yr < o.MinYear) || (o.MaxYear > 0 && yr > o.MaxYear) {
					continue
				}
			}
		}
		if skill != "" {
			matched := false
			for _, s := range o.SkillsTags {
				if strings.Contains(strings.ToLower(s), strings.ToLower(skill)) {
					matched = true
					break
				}
			}
			if !matched {
				continue
			}
		}
		if location != "" && !strings.Contains(strings.ToLower(o.Location), strings.ToLower(location)) {
			continue
		}
		if remoteStr == "true" && !o.IsRemote {
			continue
		}
		if maxCostStr != "" {
			if maxCost, err := strconv.Atoi(maxCostStr); err == nil {
				if o.Cost > maxCost {
					continue
				}
			}
		}

		// Compute match results
		matchResult := matching.ComputeMatch(profile, &o)
		results = append(results, OpportunityWithMatch{
			Opportunity: o,
			Match:       matchResult,
		})
	}

	return Success(c, results)
}

func (h *Handler) GetOpportunity(c *fiber.Ctx) error {
	id := c.Params("id")
	opp, err := h.fetchOpportunityInternal(id)
	if err == sql.ErrNoRows {
		return Error(c, fiber.StatusNotFound, "Opportunity not found")
	} else if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Database error: "+err.Error())
	}

	profileID := c.Query("profileId")
	var matchResult models.MatchResult
	if profileID != "" {
		profile, _ := h.fetchProfileInternal(profileID)
		matchResult = matching.ComputeMatch(profile, opp)
	} else {
		matchResult = matching.ComputeMatch(nil, opp)
	}

	return Success(c, fiber.Map{
		"opportunity": opp,
		"match":       matchResult,
	})
}

func (h *Handler) GetOpportunityMatch(c *fiber.Ctx) error {
	id := c.Params("id")
	profileID := c.Query("profileId")

	opp, err := h.fetchOpportunityInternal(id)
	if err != nil {
		return Error(c, fiber.StatusNotFound, "Opportunity not found")
	}

	profile, err := h.fetchProfileInternal(profileID)
	if err != nil {
		return Error(c, fiber.StatusNotFound, "Profile not found")
	}

	matchResult := matching.ComputeMatch(profile, opp)
	return Success(c, matchResult)
}

// ---------------------------------------------------------------------
// Plan Items (Save to Plan, Step Tracking, Calendar ICS)
// ---------------------------------------------------------------------

func (h *Handler) CreatePlanItem(c *fiber.Ctx) error {
	var req struct {
		ProfileID     string `json:"profileId"`
		OpportunityID string `json:"opportunityId"`
	}
	if err := c.BodyParser(&req); err != nil || req.ProfileID == "" || req.OpportunityID == "" {
		return Error(c, fiber.StatusBadRequest, "profileId and opportunityId are required")
	}

	opp, err := h.fetchOpportunityInternal(req.OpportunityID)
	if err != nil {
		return Error(c, fiber.StatusNotFound, "Opportunity not found")
	}

	// Check if already saved
	var existingID string
	err = h.DB.QueryRow("SELECT id FROM plan_items WHERE profile_id = ? AND opportunity_id = ?", req.ProfileID, req.OpportunityID).Scan(&existingID)
	if err == nil && existingID != "" {
		// Return existing
		plan, _ := h.fetchPlanItemInternal(existingID)
		return Success(c, plan)
	}

	// Generate deterministic steps
	steps := matching.GeneratePlanSteps(opp)
	stepsJSON, _ := json.Marshal(steps)
	planID := "plan-" + uuid.NewString()[:8]
	now := time.Now().UTC().Format(time.RFC3339)

	query := `
		INSERT INTO plan_items (id, profile_id, opportunity_id, steps, status, created_at)
		VALUES (?, ?, ?, ?, 'saved', ?)
	`
	_, err = h.DB.Exec(query, planID, req.ProfileID, req.OpportunityID, string(stepsJSON), now)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to save plan item: "+err.Error())
	}

	item := models.PlanItem{
		ID:            planID,
		ProfileID:     req.ProfileID,
		OpportunityID: req.OpportunityID,
		Steps:         steps,
		Status:        "saved",
		CreatedAt:     now,
		Opportunity:   opp,
	}

	return Success(c, item)
}

func (h *Handler) ListPlanItems(c *fiber.Ctx) error {
	profileID := c.Query("profileId")
	if profileID == "" {
		return Error(c, fiber.StatusBadRequest, "profileId query parameter required")
	}

	rows, err := h.DB.Query(`
		SELECT p.id, p.profile_id, p.opportunity_id, p.steps, p.status, p.created_at,
		       o.id, o.title, o.theme, o.category, o.branches, o.min_year, o.max_year,
		       o.skills_tags, o.location, o.is_remote, o.cost, o.deadline,
		       o.source_url, o.last_updated, o.eligibility_raw
		FROM plan_items p
		JOIN opportunities o ON p.opportunity_id = o.id
		WHERE p.profile_id = ?
		ORDER BY o.deadline ASC
	`, profileID)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Database error: "+err.Error())
	}
	defer rows.Close()

	var items []models.PlanItem
	for rows.Next() {
		var item models.PlanItem
		var opp models.Opportunity
		var stepsJSON, branchesJSON, skillsJSON, eligibilityJSON string

		err := rows.Scan(
			&item.ID, &item.ProfileID, &item.OpportunityID, &stepsJSON, &item.Status, &item.CreatedAt,
			&opp.ID, &opp.Title, &opp.Theme, &opp.Category, &branchesJSON, &opp.MinYear, &opp.MaxYear,
			&skillsJSON, &opp.Location, &opp.IsRemote, &opp.Cost, &opp.Deadline,
			&opp.SourceURL, &opp.LastUpdated, &eligibilityJSON,
		)
		if err != nil {
			continue
		}

		_ = json.Unmarshal([]byte(stepsJSON), &item.Steps)
		_ = json.Unmarshal([]byte(branchesJSON), &opp.Branches)
		_ = json.Unmarshal([]byte(skillsJSON), &opp.SkillsTags)
		_ = json.Unmarshal([]byte(eligibilityJSON), &opp.EligibilityRaw)
		item.Opportunity = &opp

		items = append(items, item)
	}

	return Success(c, items)
}

func (h *Handler) UpdatePlanItem(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return Error(c, fiber.StatusBadRequest, "Missing plan ID")
	}

	var req struct {
		Status string            `json:"status,omitempty"`
		StepID string            `json:"stepId,omitempty"`
		Done   *bool             `json:"done,omitempty"`
		Steps  []models.PlanStep `json:"steps,omitempty"`
	}
	if err := c.BodyParser(&req); err != nil {
		return Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	plan, err := h.fetchPlanItemInternal(id)
	if err != nil {
		return Error(c, fiber.StatusNotFound, "Plan item not found")
	}

	if req.Status != "" {
		plan.Status = req.Status
	}

	if len(req.Steps) > 0 {
		plan.Steps = req.Steps
	} else if req.StepID != "" && req.Done != nil {
		for i := range plan.Steps {
			if plan.Steps[i].ID == req.StepID {
				plan.Steps[i].Done = *req.Done
				break
			}
		}
	}

	stepsJSON, _ := json.Marshal(plan.Steps)
	_, err = h.DB.Exec("UPDATE plan_items SET steps = ?, status = ? WHERE id = ?", string(stepsJSON), plan.Status, id)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to update plan: "+err.Error())
	}

	return Success(c, plan)
}

func (h *Handler) DeletePlanItem(c *fiber.Ctx) error {
	id := c.Params("id")
	res, err := h.DB.Exec("DELETE FROM plan_items WHERE id = ?", id)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to delete plan item: "+err.Error())
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return Error(c, fiber.StatusNotFound, "Plan item not found")
	}

	return Success(c, fiber.Map{"deleted": true, "id": id})
}

func (h *Handler) GetPlanICS(c *fiber.Ctx) error {
	id := c.Params("id")
	plan, err := h.fetchPlanItemInternal(id)
	if err != nil {
		return Error(c, fiber.StatusNotFound, "Plan item not found")
	}

	opp, _ := h.fetchOpportunityInternal(plan.OpportunityID)
	icsContent := matching.GenerateICS(plan, opp)

	c.Set("Content-Type", "text/calendar; charset=utf-8")
	c.Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"plan-%s.ics\"", id))
	return c.SendString(icsContent)
}

// ---------------------------------------------------------------------
// Reminders (Strictly Opt-In, Default Off)
// ---------------------------------------------------------------------

func (h *Handler) GetReminders(c *fiber.Ctx) error {
	profileID := c.Query("profileId")
	if profileID == "" {
		return Error(c, fiber.StatusBadRequest, "profileId query parameter required")
	}

	var r models.ReminderSettings
	query := `SELECT profile_id, opted_in, quiet_hours_start, quiet_hours_end, cadence FROM reminder_settings WHERE profile_id = ?`
	err := h.DB.QueryRow(query, profileID).Scan(
		&r.ProfileID, &r.OptedIn, &r.QuietHoursStart, &r.QuietHoursEnd, &r.Cadence,
	)
	if err == sql.ErrNoRows {
		// Return transparent default (opted_in = false)
		r = models.ReminderSettings{
			ProfileID:       profileID,
			OptedIn:         false,
			QuietHoursStart: "22:00",
			QuietHoursEnd:   "08:00",
			Cadence:         "per_deadline",
		}
	} else if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Database error: "+err.Error())
	}

	return Success(c, r)
}

func (h *Handler) UpsertReminders(c *fiber.Ctx) error {
	var r models.ReminderSettings
	if err := c.BodyParser(&r); err != nil || r.ProfileID == "" {
		return Error(c, fiber.StatusBadRequest, "Invalid request body or missing profileId")
	}

	if r.QuietHoursStart == "" {
		r.QuietHoursStart = "22:00"
	}
	if r.QuietHoursEnd == "" {
		r.QuietHoursEnd = "08:00"
	}
	if r.Cadence == "" {
		r.Cadence = "per_deadline"
	}

	query := `
		INSERT INTO reminder_settings (profile_id, opted_in, quiet_hours_start, quiet_hours_end, cadence)
		VALUES (?, ?, ?, ?, ?)
		ON CONFLICT(profile_id) DO UPDATE SET
			opted_in = excluded.opted_in,
			quiet_hours_start = excluded.quiet_hours_start,
			quiet_hours_end = excluded.quiet_hours_end,
			cadence = excluded.cadence
	`
	_, err := h.DB.Exec(query, r.ProfileID, r.OptedIn, r.QuietHoursStart, r.QuietHoursEnd, r.Cadence)
	if err != nil {
		return Error(c, fiber.StatusInternalServerError, "Failed to update reminders: "+err.Error())
	}

	return Success(c, r)
}

// ---------------------------------------------------------------------
// Internal DB Helpers
// ---------------------------------------------------------------------

func (h *Handler) fetchProfileInternal(id string) (*models.Profile, error) {
	var p models.Profile
	var skillsStr string
	query := `SELECT id, branch, year, skills, location, remote_ok, budget_cap, created_at, updated_at FROM profiles WHERE id = ?`
	err := h.DB.QueryRow(query, id).Scan(
		&p.ID, &p.Branch, &p.Year, &skillsStr, &p.Location, &p.RemoteOK, &p.BudgetCap, &p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal([]byte(skillsStr), &p.Skills)
	return &p, nil
}

func (h *Handler) fetchOpportunityInternal(id string) (*models.Opportunity, error) {
	var o models.Opportunity
	var branchesJSON, skillsJSON, eligibilityJSON string
	query := `
		SELECT id, title, theme, category, branches, min_year, max_year,
		       skills_tags, location, is_remote, cost, deadline,
		       source_url, last_updated, eligibility_raw
		FROM opportunities WHERE id = ?
	`
	err := h.DB.QueryRow(query, id).Scan(
		&o.ID, &o.Title, &o.Theme, &o.Category, &branchesJSON, &o.MinYear, &o.MaxYear,
		&skillsJSON, &o.Location, &o.IsRemote, &o.Cost, &o.Deadline,
		&o.SourceURL, &o.LastUpdated, &eligibilityJSON,
	)
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal([]byte(branchesJSON), &o.Branches)
	_ = json.Unmarshal([]byte(skillsJSON), &o.SkillsTags)
	_ = json.Unmarshal([]byte(eligibilityJSON), &o.EligibilityRaw)
	return &o, nil
}

func (h *Handler) fetchPlanItemInternal(id string) (*models.PlanItem, error) {
	var item models.PlanItem
	var stepsJSON string
	query := `SELECT id, profile_id, opportunity_id, steps, status, created_at FROM plan_items WHERE id = ?`
	err := h.DB.QueryRow(query, id).Scan(&item.ID, &item.ProfileID, &item.OpportunityID, &stepsJSON, &item.Status, &item.CreatedAt)
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal([]byte(stepsJSON), &item.Steps)
	return &item, nil
}
