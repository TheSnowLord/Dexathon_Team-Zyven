package matching

import (
	"fmt"
	"time"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
	"github.com/google/uuid"
)

// GeneratePlanSteps creates a deterministic, timeline-backed checklist of preparation milestones.
func GeneratePlanSteps(opp *models.Opportunity) []models.PlanStep {
	deadlineTime, err := time.Parse("2006-01-02", opp.Deadline)
	if err != nil {
		deadlineTime = time.Now().AddDate(0, 0, 14)
	}

	formatDate := func(t time.Time) string {
		return t.Format("2006-01-02")
	}

	now := time.Now()

	calcDate := func(daysBefore int) string {
		target := deadlineTime.AddDate(0, 0, -daysBefore)
		if target.Before(now) {
			return formatDate(now)
		}
		return formatDate(target)
	}

	var steps []models.PlanStep

	// Step 1: Initial verification (7-10 days before)
	steps = append(steps, models.PlanStep{
		ID:      uuid.NewString(),
		Label:   "Read official guidelines and verify checklist items with organizer",
		Done:    false,
		DueDate: calcDate(7),
	})

	// Step 2: Milestone depending on category
	switch opp.Category {
	case "hackathon":
		steps = append(steps, models.PlanStep{
			ID:      uuid.NewString(),
			Label:   "Form or confirm team members (2–4 students) & draft project concept",
			Done:    false,
			DueDate: calcDate(5),
		})
	case "internship":
		steps = append(steps, models.PlanStep{
			ID:      uuid.NewString(),
			Label:   "Tailor resume, update portfolio links & commit GitHub repositories",
			Done:    false,
			DueDate: calcDate(5),
		})
	case "competition":
		steps = append(steps, models.PlanStep{
			ID:      uuid.NewString(),
			Label:   "Compile required student documentation, ID cards & abstract draft",
			Done:    false,
			DueDate: calcDate(5),
		})
	default:
		steps = append(steps, models.PlanStep{
			ID:      uuid.NewString(),
			Label:   "Review prerequisite reading materials and prepare questions",
			Done:    false,
			DueDate: calcDate(4),
		})
	}

	// Step 3: Pre-submission verification
	steps = append(steps, models.PlanStep{
		ID:      uuid.NewString(),
		Label:   "Complete draft submission and execute dry-run check of all links",
		Done:    false,
		DueDate: calcDate(2),
	})

	// Step 4: Submission day
	steps = append(steps, models.PlanStep{
		ID:      uuid.NewString(),
		Label:   fmt.Sprintf("Submit final registration for '%s' before cutoff", opp.Title),
		Done:    false,
		DueDate: formatDate(deadlineTime),
	})

	return steps
}
