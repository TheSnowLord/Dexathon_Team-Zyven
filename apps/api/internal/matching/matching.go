package matching

import (
	"fmt"
	"strings"
	"time"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/models"
)

// ComputeMatch evaluates a Profile against an Opportunity in a deterministic, rules-first manner.
func ComputeMatch(profile *models.Profile, opp *models.Opportunity) models.MatchResult {
	matchReasons := make([]string, 0)
	meets := make([]string, 0)
	verify := make([]string, 0)
	unmet := make([]string, 0)

	// 1. Branch evaluation
	branchMatch := false
	if len(opp.Branches) == 0 {
		branchMatch = true
		matchReasons = append(matchReasons, "Open to students of all academic branches")
	} else if profile != nil && profile.Branch != "" {
		for _, b := range opp.Branches {
			if strings.EqualFold(strings.TrimSpace(b), strings.TrimSpace(profile.Branch)) {
				branchMatch = true
				break
			}
		}
		if branchMatch {
			matchReasons = append(matchReasons, fmt.Sprintf("Matches your branch: %s", profile.Branch))
		}
	}

	// 2. Year evaluation
	yearMatch := false
	if profile != nil && profile.Year > 0 {
		minY := opp.MinYear
		maxY := opp.MaxYear
		if minY <= 0 {
			minY = 1
		}
		if maxY <= 0 {
			maxY = 4
		}
		if profile.Year >= minY && profile.Year <= maxY {
			yearMatch = true
			matchReasons = append(matchReasons, fmt.Sprintf("Eligible for Year %d students (open for Years %d–%d)", profile.Year, minY, maxY))
		}
	}

	// 3. Skills overlap
	var matchedSkills []string
	if profile != nil && len(profile.Skills) > 0 && len(opp.SkillsTags) > 0 {
		profileSkillMap := make(map[string]bool)
		for _, s := range profile.Skills {
			profileSkillMap[strings.ToLower(strings.TrimSpace(s))] = true
		}
		for _, tag := range opp.SkillsTags {
			if profileSkillMap[strings.ToLower(strings.TrimSpace(tag))] {
				matchedSkills = append(matchedSkills, tag)
			}
		}
		if len(matchedSkills) > 0 {
			matchReasons = append(matchReasons, fmt.Sprintf("Matches %d of your skills: %s", len(matchedSkills), strings.Join(matchedSkills, ", ")))
		}
	}

	// 4. Remote / Location format
	if opp.IsRemote {
		if profile != nil && profile.RemoteOK {
			matchReasons = append(matchReasons, "Matches your remote participation preference")
		} else {
			matchReasons = append(matchReasons, "Online / remote format available")
		}
	} else if profile != nil && profile.Location != "" && strings.Contains(strings.ToLower(opp.Location), strings.ToLower(profile.Location)) {
		matchReasons = append(matchReasons, fmt.Sprintf("In-person location matches your area (%s)", profile.Location))
	}

	// 5. Cost & Budget runway
	if opp.Cost == 0 {
		matchReasons = append(matchReasons, "Free registration (no participation cost)")
	} else if profile != nil && profile.BudgetCap != nil {
		if opp.Cost <= *profile.BudgetCap {
			matchReasons = append(matchReasons, fmt.Sprintf("Cost (₹%d) is within your ₹%d budget cap", opp.Cost, *profile.BudgetCap))
		}
	}

	// 6. Deadline runway
	if opp.Deadline != "" {
		if d, err := time.Parse("2006-01-02", opp.Deadline); err == nil {
			days := int(time.Until(d).Hours() / 24)
			if days > 0 {
				matchReasons = append(matchReasons, fmt.Sprintf("%d days left until deadline — actionable runway", days))
			} else if days == 0 {
				matchReasons = append(matchReasons, "Deadline is today — urgent submission needed")
			}
		}
	}

	// 7. Structured Eligibility Checklist Walk
	for _, criterion := range opp.EligibilityRaw {
		switch criterion.Type {
		case "branch":
			if branchMatch {
				meets = append(meets, criterion.Criterion)
			} else if len(opp.Branches) > 0 {
				unmet = append(unmet, fmt.Sprintf("%s (Requires %s)", criterion.Criterion, strings.Join(opp.Branches, ", ")))
			} else {
				meets = append(meets, criterion.Criterion)
			}

		case "year":
			if yearMatch {
				meets = append(meets, criterion.Criterion)
			} else if profile != nil && profile.Year > 0 {
				unmet = append(unmet, fmt.Sprintf("%s (Requires Years %d–%d)", criterion.Criterion, opp.MinYear, opp.MaxYear))
			} else {
				verify = append(verify, criterion.Criterion)
			}

		case "cost":
			if opp.Cost == 0 || (profile != nil && profile.BudgetCap != nil && opp.Cost <= *profile.BudgetCap) {
				meets = append(meets, criterion.Criterion)
			} else if profile != nil && profile.BudgetCap != nil && opp.Cost > *profile.BudgetCap {
				unmet = append(unmet, fmt.Sprintf("%s (Cost ₹%d exceeds your cap ₹%d)", criterion.Criterion, opp.Cost, *profile.BudgetCap))
			} else {
				verify = append(verify, criterion.Criterion)
			}

		case "team_size":
			// Team size is external to individual profile -> Must be verified by student
			verify = append(verify, criterion.Criterion+" — Verify team formation")

		case "custom_verify":
			// Genuinely requires organizer or portfolio verification -> Never guess
			verify = append(verify, criterion.Criterion)

		default:
			if criterion.Verifiable {
				// If marked verifiable without specific handler, default to verify for transparency
				verify = append(verify, criterion.Criterion)
			} else {
				verify = append(verify, criterion.Criterion)
			}
		}
	}

	// Calculate badge
	var fitBadge string
	if len(unmet) > 0 {
		fitBadge = "Not eligible"
	} else if len(verify) == 0 {
		fitBadge = "Looks eligible"
	} else {
		fitBadge = fmt.Sprintf("%d to verify", len(verify))
	}

	// Score calculation (transparent heuristic for sorting, match reasons take center stage)
	score := 50
	if branchMatch {
		score += 20
	}
	if yearMatch {
		score += 15
	}
	score += len(matchedSkills) * 5
	if opp.IsRemote && profile != nil && profile.RemoteOK {
		score += 10
	}
	if len(unmet) > 0 {
		score = 20
	}
	if score > 100 {
		score = 100
	}

	return models.MatchResult{
		OpportunityID: opp.ID,
		MatchReasons:  matchReasons,
		Eligibility: models.EligibilityBreakdown{
			Meets:  meets,
			Verify: verify,
			Unmet:  unmet,
		},
		FitBadge:     fitBadge,
		ScorePercent: score,
	}
}
