package seed_test

import (
	"os"
	"testing"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/store"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/seed"
)

func TestSeedDatabase(t *testing.T) {
	testDBPath := "test_compass.db"
	defer os.Remove(testDBPath)

	db, err := store.InitDB(testDBPath)
	if err != nil {
		t.Fatalf("InitDB failed: %v", err)
	}
	defer db.Close()

	if err := seed.SeedDatabase(db.DB); err != nil {
		t.Fatalf("SeedDatabase failed: %v", err)
	}

	var oppCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM opportunities").Scan(&oppCount); err != nil {
		t.Fatalf("Failed to count opportunities: %v", err)
	}
	if oppCount < 8 {
		t.Errorf("Expected at least 8 opportunities, got %d", oppCount)
	}

	var profCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM profiles WHERE id = 'demo-student-zyven'").Scan(&profCount); err != nil {
		t.Fatalf("Failed to query demo profile: %v", err)
	}
	if profCount != 1 {
		t.Errorf("Expected 1 demo profile, got %d", profCount)
	}

	var reminderCount int
	if err := db.QueryRow("SELECT COUNT(*) FROM reminder_settings WHERE profile_id = 'demo-student-zyven' AND opted_in = 0").Scan(&reminderCount); err != nil {
		t.Fatalf("Failed to query reminder settings: %v", err)
	}
	if reminderCount != 1 {
		t.Errorf("Expected default opted_in = 0 reminder settings, got %d", reminderCount)
	}
}
