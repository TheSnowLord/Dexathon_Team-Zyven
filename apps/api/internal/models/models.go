package models

type EligibilityCriterion struct {
	Criterion  string `json:"criterion"`
	Verifiable bool   `json:"verifiable"`
	Type       string `json:"type,omitempty"` // branch, year, skill, cost, custom_verify
}

type Profile struct {
	ID        string   `json:"id"`
	Branch    string   `json:"branch"`
	Year      int      `json:"year"`
	Skills    []string `json:"skills"`
	Location  string   `json:"location"`
	RemoteOK  bool     `json:"remote_ok"`
	BudgetCap *int     `json:"budget_cap"`
	CreatedAt string   `json:"created_at,omitempty"`
	UpdatedAt string   `json:"updated_at,omitempty"`
}

type Opportunity struct {
	ID             string                 `json:"id"`
	Title          string                 `json:"title"`
	Theme          string                 `json:"theme"`
	Category       string                 `json:"category"` // hackathon | internship | competition | workshop
	Branches       []string               `json:"branches"`
	MinYear        int                    `json:"min_year"`
	MaxYear        int                    `json:"max_year"`
	SkillsTags     []string               `json:"skills_tags"`
	Location       string                 `json:"location"`
	IsRemote       bool                   `json:"is_remote"`
	Cost           int                    `json:"cost"`
	Deadline       string                 `json:"deadline"` // YYYY-MM-DD
	SourceURL      string                 `json:"source_url"`
	LastUpdated    string                 `json:"last_updated"`
	EligibilityRaw []EligibilityCriterion `json:"eligibility_raw"`
}

type PlanStep struct {
	ID      string `json:"id"`
	Label   string `json:"label"`
	Done    bool   `json:"done"`
	DueDate string `json:"due_date"`
}

type PlanItem struct {
	ID            string       `json:"id"`
	ProfileID     string       `json:"profile_id"`
	OpportunityID string       `json:"opportunity_id"`
	Steps         []PlanStep   `json:"steps"`
	Status        string       `json:"status"` // saved | in_progress | done | dropped
	CreatedAt     string       `json:"created_at,omitempty"`
	Opportunity   *Opportunity `json:"opportunity,omitempty"`
}

type ReminderSettings struct {
	ProfileID       string `json:"profile_id"`
	OptedIn         bool   `json:"opted_in"`
	QuietHoursStart string `json:"quiet_hours_start"`
	QuietHoursEnd   string `json:"quiet_hours_end"`
	Cadence         string `json:"cadence"`
}

type EligibilityBreakdown struct {
	Meets  []string `json:"meets"`
	Verify []string `json:"verify"`
	Unmet  []string `json:"unmet"`
}

type MatchResult struct {
	OpportunityID string               `json:"opportunity_id"`
	MatchReasons  []string             `json:"match_reasons"`
	Eligibility   EligibilityBreakdown `json:"eligibility"`
	FitBadge      string               `json:"fit_badge"` // "Looks eligible", "2 to verify", "Check requirements"
	ScorePercent  int                  `json:"score_percent"`
}
