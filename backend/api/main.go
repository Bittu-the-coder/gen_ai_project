package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"voicecraft-market/internal/config"
	"voicecraft-market/internal/handlers"
	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/services"

	"github.com/gin-gonic/gin"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize context
	ctx := context.Background()

	// Initialize Firebase
	opt := option.WithCredentialsFile(cfg.FirebaseCredentialsFile)
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase app: %v", err)
	}

	// Initialize Firebase Auth
	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase Auth: %v", err)
	}

	// Initialize Firebase Messaging
	messagingClient, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase Messaging: %v", err)
	}

	// Initialize Firestore
	firestoreService, err := services.NewFirestoreService(ctx, cfg.ProjectID)
	if err != nil {
		log.Fatalf("Failed to initialize Firestore: %v", err)
	}
	defer firestoreService.Close()

	// Initialize services
	storageService, err := services.NewStorageService(ctx, cfg.StorageBucket, cfg.AudioBucket, cfg.ImageBucket)
	if err != nil {
		log.Fatalf("Failed to initialize Storage service: %v", err)
	}
	defer storageService.Close()

	speechService, err := services.NewSpeechService(ctx, cfg.ProjectID)
	if err != nil {
		log.Fatalf("Failed to initialize Speech service: %v", err)
	}
	defer speechService.Close()

	aiService, err := services.NewAIService(ctx, cfg.ProjectID, cfg.Location)
	if err != nil {
		log.Fatalf("Failed to initialize AI service: %v", err)
	}
	defer aiService.Close()

	notificationService := services.NewNotificationService(ctx, authClient, messagingClient)

	// Initialize handlers
	productHandler := handlers.NewProductHandler(firestoreService, storageService, aiService)
	voiceHandler := handlers.NewVoiceHandler(speechService, aiService, firestoreService, storageService)
	authHandler := handlers.NewAuthHandler(authClient, firestoreService)
	artisanHandler := handlers.NewArtisanHandler(firestoreService, storageService)
	orderHandler := handlers.NewOrderHandler(firestoreService, notificationService)

	// Setup Gin router
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Add middleware
	router.Use(middleware.Logger())
	router.Use(middleware.Recovery())
	router.Use(middleware.CORS())
	router.Use(middleware.SecurityHeaders())
	router.Use(middleware.HealthCheck())
	router.Use(middleware.RequestSize(32 << 20)) // 32MB limit

	// Public routes
	v1 := router.Group("/api/v1")
	{
		// Health check
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":    "healthy",
				"timestamp": time.Now().UTC().Format(time.RFC3339),
				"service":   "voicecraft-market-api",
				"version":   "1.0.0",
			})
		})

		// Public product routes
		v1.GET("/products", productHandler.GetProducts)
		v1.GET("/products/:id", productHandler.GetProduct)
		v1.GET("/products/search", productHandler.SearchProducts)
		v1.GET("/artisans/:artisan_id/products", productHandler.GetProductsByArtisan)

		// Public artisan routes
		v1.GET("/artisans", artisanHandler.GetArtisans)
		v1.GET("/artisans/:id", artisanHandler.GetArtisan)

		// Voice processing (public)
		v1.POST("/voice/transcribe", voiceHandler.TranscribeAudio)
		v1.POST("/voice/generate", voiceHandler.GenerateProduct)
	}

	// Authentication required routes
	auth := v1.Group("/")
	auth.Use(middleware.AuthMiddleware(authClient))
	{
		// User profile
		auth.GET("/profile", authHandler.GetProfile)
		auth.PUT("/profile", authHandler.UpdateProfile)

		// Orders
		auth.GET("/orders", orderHandler.GetUserOrders)
		auth.POST("/orders", orderHandler.CreateOrder)
		auth.GET("/orders/:id", orderHandler.GetOrder)
		auth.PUT("/orders/:id/cancel", orderHandler.CancelOrder)
	}

	// Artisan routes
	artisan := v1.Group("/artisan")
	artisan.Use(middleware.AuthMiddleware(authClient))
	artisan.Use(middleware.ArtisanMiddleware())
	{
		// Artisan profile management
		artisan.GET("/profile", artisanHandler.GetArtisanProfile)
		artisan.PUT("/profile", artisanHandler.UpdateArtisanProfile)
		artisan.POST("/profile/avatar", artisanHandler.UploadArtisanAvatar)

		// Product management
		artisan.GET("/products", productHandler.GetProductsByArtisan)
		artisan.POST("/products", productHandler.CreateProduct)
		artisan.PUT("/products/:id", productHandler.UpdateProduct)
		artisan.DELETE("/products/:id", productHandler.DeleteProduct)
		artisan.POST("/products/:id/images", productHandler.UploadProductImages)

		// Order management
		artisan.GET("/orders", orderHandler.GetArtisanOrders)
		artisan.PUT("/orders/:id/status", orderHandler.UpdateOrderStatus)
	}

	// Admin routes
	admin := v1.Group("/admin")
	admin.Use(middleware.AuthMiddleware(authClient))
	admin.Use(middleware.AdminMiddleware())
	{
		// Admin dashboard stats
		admin.GET("/stats", func(c *gin.Context) {
			// TODO: Implement admin stats
			c.JSON(http.StatusOK, gin.H{"message": "Admin stats endpoint"})
		})

		// User management
		admin.GET("/users", authHandler.GetAllUsers)
		admin.PUT("/users/:id/role", authHandler.UpdateUserRole)
		admin.DELETE("/users/:id", authHandler.DeleteUser)

		// Product moderation
		admin.GET("/products/pending", productHandler.GetProducts) // Filter pending products
		admin.PUT("/products/:id/approve", func(c *gin.Context) {
			// TODO: Implement product approval
			c.JSON(http.StatusOK, gin.H{"message": "Product approved"})
		})
	}

	// Start server
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	log.Printf("Server started on port %s", cfg.Port)

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
