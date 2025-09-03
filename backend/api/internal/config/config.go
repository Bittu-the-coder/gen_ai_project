package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server Configuration
	Port    string
	GinMode string

	// Google Cloud Configuration
	GoogleApplicationCredentials string
	GoogleProjectID              string

	// Firebase Configuration
	FirebaseProjectID   string
	FirebaseDatabaseURL string

	// Google Cloud Storage
	GCSBucketName   string
	GCSBucketAudio  string
	GCSBucketImages string

	// Google AI Services
	SpeechToTextModel string
	VertexAILocation  string
	VertexAIModel     string

	// API Keys
	WhatsAppAPIKey  string
	InstagramAPIKey string

	// CORS Configuration
	CORSOrigins []string

	// Rate Limiting
	RateLimitRequests int
	RateLimitWindow   int

	// File Upload Limits
	MaxAudioSize      string
	MaxImageSize      string
	AllowedAudioTypes []string
	AllowedImageTypes []string

	// JWT Configuration
	JWTSecret string
	JWTExpiry string

	// Database Configuration
	DBTimeout             string
	MaxConcurrentRequests int

	// Logging
	LogLevel  string
	LogFormat string
}

func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	config := &Config{
		// Server Configuration
		Port:    getEnv("PORT", "8080"),
		GinMode: getEnv("GIN_MODE", "debug"),

		// Google Cloud Configuration
		GoogleApplicationCredentials: getEnv("GOOGLE_APPLICATION_CREDENTIALS", ""),
		GoogleProjectID:              getEnv("GOOGLE_PROJECT_ID", "voicecraft-market"),

		// Firebase Configuration
		FirebaseProjectID:   getEnv("FIREBASE_PROJECT_ID", "voicecraft-market"),
		FirebaseDatabaseURL: getEnv("FIREBASE_DATABASE_URL", ""),

		// Google Cloud Storage
		GCSBucketName:   getEnv("GCS_BUCKET_NAME", "voicecraft-market-uploads"),
		GCSBucketAudio:  getEnv("GCS_BUCKET_AUDIO", "voicecraft-market-audio"),
		GCSBucketImages: getEnv("GCS_BUCKET_IMAGES", "voicecraft-market-images"),

		// Google AI Services
		SpeechToTextModel: getEnv("SPEECH_TO_TEXT_MODEL", "latest_long"),
		VertexAILocation:  getEnv("VERTEX_AI_LOCATION", "us-central1"),
		VertexAIModel:     getEnv("VERTEX_AI_MODEL", "gemini-1.5-pro"),

		// API Keys
		WhatsAppAPIKey:  getEnv("WHATSAPP_API_KEY", ""),
		InstagramAPIKey: getEnv("INSTAGRAM_API_KEY", ""),

		// CORS Configuration
		CORSOrigins: getSliceEnv("CORS_ORIGINS", []string{"http://localhost:5173", "http://localhost:3000"}),

		// Rate Limiting
		RateLimitRequests: getIntEnv("RATE_LIMIT_REQUESTS", 100),
		RateLimitWindow:   getIntEnv("RATE_LIMIT_WINDOW", 3600),

		// File Upload Limits
		MaxAudioSize:      getEnv("MAX_AUDIO_SIZE", "50MB"),
		MaxImageSize:      getEnv("MAX_IMAGE_SIZE", "10MB"),
		AllowedAudioTypes: getSliceEnv("ALLOWED_AUDIO_TYPES", []string{"audio/mpeg", "audio/wav", "audio/mp3", "audio/m4a"}),
		AllowedImageTypes: getSliceEnv("ALLOWED_IMAGE_TYPES", []string{"image/jpeg", "image/png", "image/webp"}),

		// JWT Configuration
		JWTSecret: getEnv("JWT_SECRET", "your_jwt_secret_key_here"),
		JWTExpiry: getEnv("JWT_EXPIRY", "24h"),

		// Database Configuration
		DBTimeout:             getEnv("DB_TIMEOUT", "30s"),
		MaxConcurrentRequests: getIntEnv("MAX_CONCURRENT_REQUESTS", 1000),

		// Logging
		LogLevel:  getEnv("LOG_LEVEL", "info"),
		LogFormat: getEnv("LOG_FORMAT", "json"),
	}

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getSliceEnv(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		return strings.Split(value, ",")
	}
	return defaultValue
}

func getBoolEnv(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
