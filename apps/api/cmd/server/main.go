package main

import (
	"log"
	"os"

	"github.com/TheSnowLord/Dexathon_Team-Zyven/apps/api/internal/store"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

type APIResponse struct {
	Data  interface{} `json:"data"`
	Error interface{} `json:"error"`
}

type APIError struct {
	Message string `json:"message"`
}

func Success(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusOK).JSON(APIResponse{
		Data:  data,
		Error: nil,
	})
}

func Error(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(APIResponse{
		Data: nil,
		Error: APIError{
			Message: message,
		},
	})
}

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

	v1.Get("/health", func(c *fiber.Ctx) error {
		if err := db.Ping(); err != nil {
			return Error(c, fiber.StatusServiceUnavailable, "Database unhealthy")
		}
		return Success(c, fiber.Map{
			"status":  "ok",
			"service": "ACE Opportunity Compass API",
			"version": "v1.0.0",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting ACE Opportunity Compass API server on port :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server stopped: %v", err)
	}
}
