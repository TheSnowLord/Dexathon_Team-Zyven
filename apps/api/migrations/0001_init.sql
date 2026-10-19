-- SQLite Schema for ACE Opportunity Compass

CREATE TABLE IF NOT EXISTS profiles (
  id            TEXT PRIMARY KEY,
  branch        TEXT NOT NULL,
  year          INTEGER NOT NULL,
  skills        TEXT NOT NULL,        -- JSON array of strings
  location      TEXT,
  remote_ok     BOOLEAN DEFAULT 0,
  budget_cap    INTEGER,              -- max cost student can justify, null = no cap
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS opportunities (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  theme           TEXT,
  category        TEXT,               -- hackathon / internship / competition / workshop
  branches        TEXT,                -- JSON array of strings, empty = open to all
  min_year        INTEGER,
  max_year        INTEGER,
  skills_tags     TEXT,                -- JSON array of strings
  location        TEXT,
  is_remote       BOOLEAN DEFAULT 0,
  cost            INTEGER DEFAULT 0,
  deadline        DATE,
  source_url      TEXT NOT NULL,
  last_updated    DATETIME NOT NULL,
  eligibility_raw TEXT                 -- JSON array of {criterion: string, verifiable: bool}
);

CREATE TABLE IF NOT EXISTS plan_items (
  id              TEXT PRIMARY KEY,
  profile_id      TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id  TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  steps           TEXT NOT NULL,       -- JSON array of {id: string, label: string, done: bool, due_date: string}
  status          TEXT DEFAULT 'saved',-- saved / in_progress / done / dropped
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminder_settings (
  profile_id      TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  opted_in        BOOLEAN DEFAULT 0,
  quiet_hours_start TEXT,              -- "22:00"
  quiet_hours_end   TEXT,              -- "08:00"
  cadence         TEXT DEFAULT 'per_deadline'
);
