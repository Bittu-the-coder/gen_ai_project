package handlers

import (
	"net/http"
	"strconv"

	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/models"
	"voicecraft-market/internal/services"

	"github.com/gin-gonic/gin"
)

type ArtisanHandler struct {
	firestoreService *services.FirestoreService
	storageService   *services.StorageService
}

func NewArtisanHandler(firestoreService *services.FirestoreService, storageService *services.StorageService) *ArtisanHandler {
	return &ArtisanHandler{
		firestoreService: firestoreService,
		storageService:   storageService,
	}
}

// GetArtisans retrieves all artisans with pagination
func (h *ArtisanHandler) GetArtisans(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")
	category := c.Query("category")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Build filter conditions
	filters := make(map[string]interface{})
	if category != "" {
		filters["specializations"] = category
	}
	if search != "" {
		filters["search"] = search
	}

	// Get artisans from Firestore
	artisans, total, err := h.firestoreService.GetArtisansWithFilters(filters, "created_at", "desc", limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch artisans"})
		return
	}

	// Calculate pagination info
	totalPages := (total + limit - 1) / limit
	hasNext := page < totalPages
	hasPrev := page > 1

	c.JSON(http.StatusOK, gin.H{
		"artisans": artisans,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
			"has_next":    hasNext,
			"has_prev":    hasPrev,
		},
	})
}

// GetArtisan retrieves a single artisan by ID
func (h *ArtisanHandler) GetArtisan(c *gin.Context) {
	artisanID := c.Param("id")
	if artisanID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Artisan ID is required"})
		return
	}

	artisan, err := h.firestoreService.GetArtisan(artisanID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artisan not found"})
		return
	}

	// Get artisan's products
	filters := map[string]interface{}{
		"artisan_id": artisanID,
	}

	products, _, err := h.firestoreService.GetProductsWithFilters(filters, "created_at", "desc", 10, 0)
	if err != nil {
		// Don't fail if products can't be fetched
		products = []models.Product{}
	}

	c.JSON(http.StatusOK, gin.H{
		"artisan":  artisan,
		"products": products,
	})
}

// GetArtisanProfile retrieves the current artisan's profile
func (h *ArtisanHandler) GetArtisanProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	artisan, err := h.firestoreService.GetArtisan(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artisan profile not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"artisan": artisan})
}

// UpdateArtisanProfile updates the current artisan's profile
func (h *ArtisanHandler) UpdateArtisanProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Prevent updating certain fields
	delete(updates, "id")
	delete(updates, "user_id")
	delete(updates, "created_at")

	// Check if artisan profile exists
	existingArtisan, err := h.firestoreService.GetArtisan(userID)
	if err != nil {
		// Create new artisan profile
		artisan := models.ArtisanProfile{
			UserID: userID,
		}

		// Apply updates to new profile
		if name, ok := updates["name"]; ok {
			artisan.Name = name.(string)
		}
		if bio, ok := updates["bio"]; ok {
			artisan.Bio = bio.(string)
		}
		if location, ok := updates["location"]; ok {
			artisan.Location = location.(string)
		}
		if specializations, ok := updates["specializations"]; ok {
			if specArray, ok := specializations.([]interface{}); ok {
				artisan.Specializations = make([]string, len(specArray))
				for i, spec := range specArray {
					artisan.Specializations[i] = spec.(string)
				}
			}
		}

		artisanID, err := h.firestoreService.CreateArtisan(&artisan)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create artisan profile"})
			return
		}

		artisan.ID = artisanID
		c.JSON(http.StatusCreated, gin.H{"artisan": artisan})
		return
	}

	// Update existing profile
	err = h.firestoreService.UpdateArtisan(existingArtisan.ID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update artisan profile"})
		return
	}

	// Get updated artisan
	updatedArtisan, err := h.firestoreService.GetArtisan(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"artisan": updatedArtisan})
}

// UploadArtisanAvatar handles artisan avatar upload
func (h *ArtisanHandler) UploadArtisanAvatar(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Handle file upload
	file, header, err := c.Request.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Avatar file is required"})
		return
	}
	defer file.Close()

	// Validate file type
	allowedTypes := []string{"jpeg", "jpg", "png", "webp"}
	if !h.storageService.ValidateFileType(header.Filename, allowedTypes) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, and WebP are allowed"})
		return
	}

	// Upload to storage
	result, err := h.storageService.UploadImage(file, header, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload avatar"})
		return
	}

	// Update artisan profile with avatar URL
	updates := map[string]interface{}{
		"avatar_url": result.URL,
	}

	// Check if artisan profile exists
	existingArtisan, err := h.firestoreService.GetArtisan(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Artisan profile not found"})
		return
	}

	err = h.firestoreService.UpdateArtisan(existingArtisan.ID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update artisan profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Avatar uploaded successfully",
		"avatar_url": result.URL,
	})
}
