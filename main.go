package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func initDB() error {
	var err error
	db, err = sql.Open("sqlite3", "./wraps.db")
	if err != nil {
		return err
	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS wraps (
		id TEXT PRIMARY KEY,
		stats TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createTableSQL)
	return err
}

func main() {
	if err := initDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	r.Static("/assets", "./dist/assets")
	r.StaticFile("/vite.svg", "./dist/vite.svg")

	api := r.Group("/api")
	{
		api.GET("/health", healthCheck)
		api.POST("/share", createShareableLink)
		api.GET("/share/:id", getSharedData)
	}

	r.NoRoute(func(c *gin.Context) {
		c.File("./dist/index.html")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8034"
	}
	r.Run(":" + port)
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"message": "InstaWrapped backend is running",
		"version": "1.0.0",
	})
}

func createShareableLink(c *gin.Context) {
	var req struct {
		Stats map[string]interface{} `json:"stats"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	shareID := generateShortID()

	statsJSON, err := json.Marshal(req.Stats)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize stats"})
		return
	}

	_, err = db.Exec("INSERT INTO wraps (id, stats) VALUES (?, ?)", shareID, string(statsJSON))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store wrap data"})
		return
	}

	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "https://ig.indrajeeth.in"
	}
	c.JSON(http.StatusOK, gin.H{
		"shareId":  shareID,
		"shareUrl": fmt.Sprintf("%s/wrap/%s", baseURL, shareID),
		"message":  "Shareable link created successfully",
	})
}

func getSharedData(c *gin.Context) {
	shareID := c.Param("id")

	var statsJSON string
	err := db.QueryRow("SELECT stats FROM wraps WHERE id = ?", shareID).Scan(&statsJSON)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Shared data not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve wrap data"})
		return
	}

	var stats map[string]interface{}
	if err := json.Unmarshal([]byte(statsJSON), &stats); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse wrap data"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func generateShortID() string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 8)
	rand.Read(b)
	for i := range b {
		b[i] = chars[int(b[i])%len(chars)]
	}
	return string(b)
}
