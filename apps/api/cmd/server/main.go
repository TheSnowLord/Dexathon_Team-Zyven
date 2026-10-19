package main

import (
	"log"
	"os"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/handlers"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/store"
	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/seed"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	dbPath := os.Getenv("DATABASE_URL")
	if dbPath == "" {
		dbPath = "data/compass.db"
	}

	db, err := store.InitDB(dbPath)
	if err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}
	defer db.Close()

	if err := seed.SeedDatabase(db.DB); err != nil {
		log.Printf("Warning: Seeding failed: %v", err)
	}

	h := handlers.NewHandler(db.DB)

	app := fiber.New(fiber.Config{
		AppName: "ACE Opportunity Compass API v1",
	})

	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, X-Profile-ID",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	v1 := app.Group("/api/v1")

	// Health
	v1.Get("/health", func(c *fiber.Ctx) error {
		if err := db.Ping(); err != nil {
			return handlers.Error(c, fiber.StatusServiceUnavailable, "Database unhealthy")
		}
		return handlers.Success(c, fiber.Map{
			"status":  "ok",
			"service": "ACE Opportunity Compass API",
			"version": "v1.0.0",
		})
	})

	// Profiles (Stage 2: Profile)
	v1.Post("/profiles", h.UpsertProfile)
	v1.Get("/profiles/:id", h.GetProfile)
	v1.Delete("/profiles/:id", h.DeleteProfile) // Full deletion guardrail

	// Opportunities (Stage 1: Discover & Stage 3: Explain)
	v1.Get("/opportunities", h.ListOpportunities)
	v1.Get("/opportunities/:id", h.GetOpportunity)
	v1.Get("/opportunities/:id/match", h.GetOpportunityMatch)

	// Plans (Stage 4: Plan)
	v1.Post("/plan", h.CreatePlanItem)
	v1.Get("/plan", h.ListPlanItems)
	v1.Patch("/plan/:id", h.UpdatePlanItem)
	v1.Delete("/plan/:id", h.DeletePlanItem)
	v1.Get("/plan/:id/ics", h.GetPlanICS)

	// Reminders (Stage 5: Remind)
	v1.Get("/reminders", h.GetReminders)
	v1.Put("/reminders", h.UpsertReminders)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting ACE Opportunity Compass API server on port :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server stopped: %v", err)
	}
}
