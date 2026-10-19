package matching

import (
	"fmt"
	"strings"
	"time"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
)

// GenerateICS builds an RFC 5545 compliant iCalendar string for a plan item's steps and deadline.
func GenerateICS(plan *models.PlanItem, opp *models.Opportunity) string {
	var b strings.Builder
	nowUTC := time.Now().UTC().Format("20060102T150405Z")

	b.WriteString("BEGIN:VCALENDAR\r\n")
	b.WriteString("VERSION:2.0\r\n")
	b.WriteString("PRODID:-//ACE Opportunity Compass//Team Zyven//EN\r\n")
	b.WriteString("CALSCALE:GREGORIAN\r\n")
	b.WriteString("METHOD:PUBLISH\r\n")

	title := "Opportunity Milestone"
	source := "https://allcollegeevent.com"
	if opp != nil {
		title = opp.Title
		source = opp.SourceURL
	}

	for i, step := range plan.Steps {
		uid := fmt.Sprintf("%s-%d@opportunitycompass.ace", step.ID, i)
		dueDate, err := time.Parse("2006-01-02", step.DueDate)
		if err != nil {
			dueDate = time.Now().AddDate(0, 0, i+1)
		}
		dtStart := dueDate.Format("20060102")
		dtEnd := dueDate.AddDate(0, 0, 1).Format("20060102")

		status := "NEEDS-ACTION"
		if step.Done {
			status = "COMPLETED"
		}

		b.WriteString("BEGIN:VEVENT\r\n")
		b.WriteString(fmt.Sprintf("UID:%s\r\n", uid))
		b.WriteString(fmt.Sprintf("DTSTAMP:%s\r\n", nowUTC))
		b.WriteString(fmt.Sprintf("DTSTART;VALUE=DATE:%s\r\n", dtStart))
		b.WriteString(fmt.Sprintf("DTEND;VALUE=DATE:%s\r\n", dtEnd))
		b.WriteString(fmt.Sprintf("SUMMARY:%s [%s]\r\n", step.Label, title))
		b.WriteString(fmt.Sprintf("DESCRIPTION:Opportunity Compass preparation milestone for %s.\\nSource: %s\r\n", title, source))
		b.WriteString(fmt.Sprintf("STATUS:%s\r\n", status))
		b.WriteString("END:VEVENT\r\n")
	}

	// Also add the event deadline itself
	if opp != nil && opp.Deadline != "" {
		if deadlineDate, err := time.Parse("2006-01-02", opp.Deadline); err == nil {
			dtStart := deadlineDate.Format("20060102")
			dtEnd := deadlineDate.AddDate(0, 0, 1).Format("20060102")
			b.WriteString("BEGIN:VEVENT\r\n")
			b.WriteString(fmt.Sprintf("UID:deadline-%s@opportunitycompass.ace\r\n", opp.ID))
			b.WriteString(fmt.Sprintf("DTSTAMP:%s\r\n", nowUTC))
			b.WriteString(fmt.Sprintf("DTSTART;VALUE=DATE:%s\r\n", dtStart))
			b.WriteString(fmt.Sprintf("DTEND;VALUE=DATE:%s\r\n", dtEnd))
			b.WriteString(fmt.Sprintf("SUMMARY:FINAL DEADLINE: %s\r\n", opp.Title))
			b.WriteString(fmt.Sprintf("DESCRIPTION:Final application deadline for %s.\\nSource: %s\r\n", opp.Title, opp.SourceURL))
			b.WriteString("STATUS:CONFIRMED\r\n")
			b.WriteString("END:VEVENT\r\n")
		}
	}

	b.WriteString("END:VCALENDAR\r\n")
	return b.String()
}
