package store

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/migrations"
	_ "modernc.org/sqlite"
)

type DB struct {
	*sql.DB
}

func InitDB(dbPath string) (*DB, error) {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, fmt.Errorf("failed to create db directory: %w", err)
		}
	}

	// Open SQLite database using modernc.org/sqlite with pragmas
	dsn := fmt.Sprintf("%s?_pragma=foreign_keys(1)&_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)", dbPath)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	wrapped := &DB{db}

	if err := wrapped.runMigrations(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Printf("SQLite database initialized at %s with WAL mode and foreign keys enabled", dbPath)
	return wrapped, nil
}

func (db *DB) runMigrations() error {
	migrationFile, err := migrations.FS.ReadFile("0001_init.sql")
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	if _, err := db.Exec(string(migrationFile)); err != nil {
		return fmt.Errorf("failed to execute migration 0001_init.sql: %w", err)
	}

	return nil
}
