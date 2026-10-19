package seed

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
)

func SeedDatabase(db *sql.DB) error {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM opportunities").Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to check opportunities count: %w", err)
	}

	if count > 0 {
		log.Printf("Database already contains %d opportunities; skipping seed", count)
		return nil
	}

	log.Println("Seeding opportunities and default demo student profile...")

	now := time.Now().UTC().Format(time.RFC3339)

	opportunities := []models.Opportunity{
		{
			ID:          "opp-ai-impact-2026",
			Title:       "AI for Impact Hackathon",
			Theme:       "AI for Social Good & Civic Tech",
			Category:    "hackathon",
			Branches:    []string{"Computer Science & Engineering", "Information Technology", "Electronics & Communication"},
			MinYear:     1,
			MaxYear:     4,
			SkillsTags:  []string{"Python", "AI", "Machine Learning", "FastAPI", "React"},
			Location:    "Pune / Online",
			IsRemote:    true,
			Cost:        0,
			Deadline:    "2026-11-15",
			SourceURL:   "https://allcollegeevent.com/events/ai-for-impact-hackathon",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Enrolled undergraduate engineering student (Years 1-4)", Verifiable: true, Type: "year"},
				{Criterion: "Team size between 2 and 4 members", Verifiable: true, Type: "team_size"},
				{Criterion: "Eligible for CSE, IT, or ECE branch", Verifiable: true, Type: "branch"},
				{Criterion: "Prior hackathon experience or project repository preferred", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-gsoc-incubator",
			Title:       "Google Summer of Code Mentorship Incubator",
			Theme:       "Open Source Systems & Tooling",
			Category:    "internship",
			Branches:    []string{"Computer Science & Engineering", "Information Technology"},
			MinYear:     2,
			MaxYear:     4,
			SkillsTags:  []string{"Go", "Python", "Git", "Docker", "Linux"},
			Location:    "Remote",
			IsRemote:    true,
			Cost:        0,
			Deadline:    "2026-11-28",
			SourceURL:   "https://allcollegeevent.com/events/gsoc-mentorship-incubator",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "2nd year undergraduate or above", Verifiable: true, Type: "year"},
				{Criterion: "Open to CSE and IT branches", Verifiable: true, Type: "branch"},
				{Criterion: "Public GitHub profile with verified commit history", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-robotics-challenge",
			Title:       "Autonomous Robotics Challenge 2026",
			Theme:       "Robotics & Embedded Systems",
			Category:    "competition",
			Branches:    []string{"Mechanical Engineering", "Electronics & Communication", "Electrical Engineering", "Robotics"},
			MinYear:     2,
			MaxYear:     4,
			SkillsTags:  []string{"ROS", "C++", "Embedded Systems", "Hardware", "CAD"},
			Location:    "Bengaluru, Karnataka",
			IsRemote:    false,
			Cost:        500,
			Deadline:    "2026-11-05",
			SourceURL:   "https://allcollegeevent.com/events/autonomous-robotics-challenge",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Enrolled in Mechanical, ECE, or Electrical branches", Verifiable: true, Type: "branch"},
				{Criterion: "At least 2nd year student", Verifiable: true, Type: "year"},
				{Criterion: "Hardware safety clearance certificate required at venue", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-cloud-bootcamp",
			Title:       "Cloud Native Microservices Bootcamp",
			Theme:       "Cloud Infrastructure & DevOps",
			Category:    "workshop",
			Branches:    []string{}, // Open to all branches
			MinYear:     1,
			MaxYear:     4,
			SkillsTags:  []string{"Kubernetes", "Docker", "Go", "Cloud Architecture"},
			Location:    "Online",
			IsRemote:    true,
			Cost:        0,
			Deadline:    "2026-10-30",
			SourceURL:   "https://allcollegeevent.com/events/cloud-native-bootcamp",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Open to all engineering branches and study years", Verifiable: true, Type: "branch"},
				{Criterion: "Free registration with college email address", Verifiable: true, Type: "cost"},
				{Criterion: "Laptop with minimum 8GB RAM required for local labs", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-fintech-hft",
			Title:       "FinTech High-Frequency Trading Hackathon",
			Theme:       "Quantitative Algorithms & Order Books",
			Category:    "hackathon",
			Branches:    []string{"Computer Science & Engineering", "Information Technology", "Mathematics & Computing"},
			MinYear:     3,
			MaxYear:     4,
			SkillsTags:  []string{"C++", "Python", "Algorithms", "Data Structures"},
			Location:    "Mumbai, Maharashtra",
			IsRemote:    false,
			Cost:        250,
			Deadline:    "2026-12-01",
			SourceURL:   "https://allcollegeevent.com/events/fintech-hft-hackathon",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "3rd or 4th year undergraduate students only", Verifiable: true, Type: "year"},
				{Criterion: "Prior coursework in Algorithms or Distributed Systems", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-women-in-tech",
			Title:       "Women in Tech Engineering Fellowship",
			Theme:       "Diversity in Software Engineering",
			Category:    "internship",
			Branches:    []string{}, // Open to all
			MinYear:     1,
			MaxYear:     3,
			SkillsTags:  []string{"JavaScript", "React", "TypeScript", "Python"},
			Location:    "Hybrid (Mumbai / Remote)",
			IsRemote:    true,
			Cost:        0,
			Deadline:    "2026-11-20",
			SourceURL:   "https://allcollegeevent.com/events/women-in-tech-fellowship",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Enrolled in Years 1-3 of recognized degree program", Verifiable: true, Type: "year"},
				{Criterion: "Identification with underrepresented gender in tech", Verifiable: false, Type: "custom_verify"},
				{Criterion: "Commitment of 15 hours per week during term", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-cyber-ctf",
			Title:       "National Cyber Defense CTF 2026",
			Theme:       "Offensive & Defensive Security",
			Category:    "competition",
			Branches:    []string{"Computer Science & Engineering", "Information Technology"},
			MinYear:     1,
			MaxYear:     4,
			SkillsTags:  []string{"Linux", "Networking", "Cryptography", "Reverse Engineering"},
			Location:    "Online",
			IsRemote:    true,
			Cost:        0,
			Deadline:    "2026-11-10",
			SourceURL:   "https://allcollegeevent.com/events/national-cyber-defense-ctf",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Open to CSE and IT enrolled students", Verifiable: true, Type: "branch"},
				{Criterion: "Free entry for all valid student credentials", Verifiable: true, Type: "cost"},
				{Criterion: "Must present active college ID card during briefing", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-design-workshop",
			Title:       "UI/UX Design Systems Workshop & Crit",
			Theme:       "Design Systems & Product Interaction",
			Category:    "workshop",
			Branches:    []string{}, // Open to all
			MinYear:     1,
			MaxYear:     4,
			SkillsTags:  []string{"Figma", "Design Systems", "User Research", "Prototyping"},
			Location:    "Online",
			IsRemote:    true,
			Cost:        150,
			Deadline:    "2026-11-02",
			SourceURL:   "https://allcollegeevent.com/events/ui-ux-design-systems-workshop",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "Open to all disciplines and study years", Verifiable: true, Type: "branch"},
				{Criterion: "Registration fee under student budget threshold", Verifiable: true, Type: "cost"},
				{Criterion: "Bring one draft wireframe or portfolio link for live crit", Verifiable: false, Type: "custom_verify"},
			},
		},
		{
			ID:          "opp-cleantech-mobility",
			Title:       "Green Mobility CleanTech Challenge",
			Theme:       "EV Battery & Energy Efficiency",
			Category:    "competition",
			Branches:    []string{"Mechanical Engineering", "Electrical Engineering", "Chemical Engineering"},
			MinYear:     2,
			MaxYear:     4,
			SkillsTags:  []string{"CAD", "MATLAB", "Simulation", "Clean Energy"},
			Location:    "Pune, Maharashtra",
			IsRemote:    false,
			Cost:        0,
			Deadline:    "2026-12-15",
			SourceURL:   "https://allcollegeevent.com/events/cleantech-green-mobility-challenge",
			LastUpdated: now,
			EligibilityRaw: []models.EligibilityCriterion{
				{Criterion: "2nd to 4th year core engineering students", Verifiable: true, Type: "year"},
				{Criterion: "Faculty mentor approval letter required prior to Stage 2", Verifiable: false, Type: "custom_verify"},
			},
		},
	}

	for _, opp := range opportunities {
		branchesJSON, _ := json.Marshal(opp.Branches)
		skillsJSON, _ := json.Marshal(opp.SkillsTags)
		eligibilityJSON, _ := json.Marshal(opp.EligibilityRaw)

		_, err := db.Exec(`
			INSERT INTO opportunities (
				id, title, theme, category, branches, min_year, max_year,
				skills_tags, location, is_remote, cost, deadline,
				source_url, last_updated, eligibility_raw
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
			opp.ID, opp.Title, opp.Theme, opp.Category, string(branchesJSON), opp.MinYear, opp.MaxYear,
			string(skillsJSON), opp.Location, opp.IsRemote, opp.Cost, opp.Deadline,
			opp.SourceURL, opp.LastUpdated, string(eligibilityJSON),
		)
		if err != nil {
			return fmt.Errorf("failed to insert seed opportunity %s: %w", opp.ID, err)
		}
	}

	// Seed default demo profile
	demoProfileSkills, _ := json.Marshal([]string{"Python", "AI", "Machine Learning", "FastAPI", "React", "Git"})
	budgetCap := 500
	_, err = db.Exec(`
		INSERT OR IGNORE INTO profiles (
			id, branch, year, skills, location, remote_ok, budget_cap, created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		"demo-student-zyven",
		"Computer Science & Engineering",
		2,
		string(demoProfileSkills),
		"Maharashtra",
		true,
		budgetCap,
		now,
		now,
	)
	if err != nil {
		return fmt.Errorf("failed to insert demo profile: %w", err)
	}

	// Seed default reminder settings (OptedIn: false by default!)
	_, err = db.Exec(`
		INSERT OR IGNORE INTO reminder_settings (
			profile_id, opted_in, quiet_hours_start, quiet_hours_end, cadence
		) VALUES (?, ?, ?, ?, ?)
	`,
		"demo-student-zyven",
		false,
		"22:00",
		"08:00",
		"per_deadline",
	)
	if err != nil {
		return fmt.Errorf("failed to insert default reminder settings: %w", err)
	}

	log.Printf("Successfully seeded %d opportunities, demo profile, and reminder settings", len(opportunities))
	return nil
}
