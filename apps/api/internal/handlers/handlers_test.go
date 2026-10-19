package handlers_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/handlers"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/store"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/seed"
	"github.com/gofiber/fiber/v2"
)

func setupTestApp(t *testing.T) (*fiber.App, func()) {
	testDB := "test_api_core.db"
	db, err := store.InitDB(testDB)
	if err != nil {
		t.Fatalf("InitDB failed: %v", err)
	}

	if err := seed.SeedDatabase(db.DB); err != nil {
		t.Fatalf("SeedDatabase failed: %v", err)
	}

	h := handlers.NewHandler(db.DB)
	app := fiber.New()
	v1 := app.Group("/api/v1")

	v1.Get("/health", func(c *fiber.Ctx) error {
		return handlers.Success(c, fiber.Map{"status": "ok"})
	})
	v1.Post("/profiles", h.UpsertProfile)
	v1.Get("/profiles/:id", h.GetProfile)
	v1.Delete("/profiles/:id", h.DeleteProfile)

	v1.Get("/opportunities", h.ListOpportunities)
	v1.Get("/opportunities/:id", h.GetOpportunity)
	v1.Get("/opportunities/:id/match", h.GetOpportunityMatch)

	v1.Post("/plan", h.CreatePlanItem)
	v1.Get("/plan", h.ListPlanItems)
	v1.Patch("/plan/:id", h.UpdatePlanItem)
	v1.Delete("/plan/:id", h.DeletePlanItem)
	v1.Get("/plan/:id/ics", h.GetPlanICS)

	v1.Get("/reminders", h.GetReminders)
	v1.Put("/reminders", h.UpsertReminders)

	teardown := func() {
		db.Close()
		os.Remove(testDB)
	}

	return app, teardown
}

func TestAPICoreFlow(t *testing.T) {
	app, teardown := setupTestApp(t)
	defer teardown()

	// 1. Healthcheck
	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	resp, err := app.Test(req)
	if err != nil || resp.StatusCode != 200 {
		t.Fatalf("Health check failed with status %d: %v", resp.StatusCode, err)
	}

	// 2. Fetch seeded demo profile
	req = httptest.NewRequest("GET", "/api/v1/profiles/demo-student-zyven", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Expected demo profile 200, got %d", resp.StatusCode)
	}

	// 3. Create / Upsert a custom student profile
	budgetCap := 300
	customProfile := models.Profile{
		ID:        "test-student-42",
		Branch:    "Information Technology",
		Year:      3,
		Skills:    []string{"Go", "Python", "Docker"},
		Location:  "Pune",
		RemoteOK:  true,
		BudgetCap: &budgetCap,
	}
	bodyBytes, _ := json.Marshal(customProfile)
	req = httptest.NewRequest("POST", "/api/v1/profiles", bytes.NewReader(bodyBytes))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Create profile failed with status %d", resp.StatusCode)
	}

	// 4. List opportunities with profile match
	req = httptest.NewRequest("GET", "/api/v1/opportunities?profileId=demo-student-zyven", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("List opportunities failed with status %d", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	var oppsResp struct {
		Data []struct {
			models.Opportunity
			Match models.MatchResult `json:"match"`
		} `json:"data"`
	}
	_ = json.Unmarshal(body, &oppsResp)
	if len(oppsResp.Data) < 8 {
		t.Errorf("Expected at least 8 opportunities, got %d", len(oppsResp.Data))
	}

	// 5. Check match explanation for "AI for Impact Hackathon"
	req = httptest.NewRequest("GET", "/api/v1/opportunities/opp-ai-impact-2026/match?profileId=demo-student-zyven", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Match explanation failed with status %d", resp.StatusCode)
	}
	body, _ = io.ReadAll(resp.Body)
	var matchResp struct {
		Data models.MatchResult `json:"data"`
	}
	_ = json.Unmarshal(body, &matchResp)
	if len(matchResp.Data.MatchReasons) == 0 {
		t.Errorf("Expected match reasons, got empty")
	}
	if len(matchResp.Data.Eligibility.Verify) == 0 {
		t.Errorf("Expected at least 1 verify item, got 0")
	}

	// 6. Save to plan
	saveReq := map[string]string{
		"profileId":     "demo-student-zyven",
		"opportunityId": "opp-ai-impact-2026",
	}
	saveBytes, _ := json.Marshal(saveReq)
	req = httptest.NewRequest("POST", "/api/v1/plan", bytes.NewReader(saveBytes))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Save to plan failed with status %d", resp.StatusCode)
	}
	body, _ = io.ReadAll(resp.Body)
	var planResp struct {
		Data models.PlanItem `json:"data"`
	}
	_ = json.Unmarshal(body, &planResp)
	planID := planResp.Data.ID
	if len(planResp.Data.Steps) == 0 {
		t.Fatalf("Expected plan steps generated, got 0")
	}

	// 7. Download Calendar .ics
	req = httptest.NewRequest("GET", "/api/v1/plan/"+planID+"/ics", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Get ICS failed with status %d", resp.StatusCode)
	}
	icsBody, _ := io.ReadAll(resp.Body)
	icsStr := string(icsBody)
	if !strings.Contains(icsStr, "BEGIN:VCALENDAR") || !strings.Contains(icsStr, "BEGIN:VEVENT") {
		t.Errorf("Invalid ICS calendar content:\n%s", icsStr)
	}

	// 8. Test Reminder Settings (Opt-in toggle)
	req = httptest.NewRequest("GET", "/api/v1/reminders?profileId=demo-student-zyven", nil)
	resp, _ = app.Test(req)
	body, _ = io.ReadAll(resp.Body)
	var remResp struct {
		Data models.ReminderSettings `json:"data"`
	}
	_ = json.Unmarshal(body, &remResp)
	if remResp.Data.OptedIn {
		t.Errorf("Reminders MUST default to opted_in: false")
	}

	// Update reminders to opted-in
	remResp.Data.OptedIn = true
	remUpdateBytes, _ := json.Marshal(remResp.Data)
	req = httptest.NewRequest("PUT", "/api/v1/reminders", bytes.NewReader(remUpdateBytes))
	req.Header.Set("Content-Type", "application/json")
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Update reminders failed with status %d", resp.StatusCode)
	}

	// 9. Full Data Deletion Test
	req = httptest.NewRequest("DELETE", "/api/v1/profiles/demo-student-zyven", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 200 {
		t.Fatalf("Delete profile failed with status %d", resp.StatusCode)
	}

	// Verify profile is genuinely gone
	req = httptest.NewRequest("GET", "/api/v1/profiles/demo-student-zyven", nil)
	resp, _ = app.Test(req)
	if resp.StatusCode != 404 {
		t.Errorf("Expected 404 after deletion, got %d", resp.StatusCode)
	}
}
