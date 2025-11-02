package handlers

import (
	"net/http"
	"strconv"
	"time"

	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/models"
	"voicecraft-market/internal/services"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authClient       *auth.Client
	firestoreService *services.FirestoreService
}

func NewAuthHandler(authClient *auth.Client, firestoreService *services.FirestoreService) *AuthHandler {
	return &AuthHandler{
		authClient:       authClient,
		firestoreService: firestoreService,
	}
}

// GetProfile returns the current user's profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	// Get user from Firestore
	user, err := h.firestoreService.GetUser(userID)
	if err != nil {
		// If user doesn't exist, try to create from Firebase Auth
		firebaseUser, err := h.authClient.GetUser(c.Request.Context(), userID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Create basic user profile
		newUser := &models.User{
			ID:        firebaseUser.UID,
			Email:     firebaseUser.Email,
			Name:      firebaseUser.DisplayName,
			Phone:     firebaseUser.PhoneNumber,
			Role:      models.RoleBuyer,
			Status:    "active",
			Language:  "english",
			CreatedAt: time.UnixMilli(firebaseUser.UserMetadata.CreationTimestamp),
			UpdatedAt: time.Now(),
		}

		_, err = h.firestoreService.CreateUser(newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user profile"})
			return
		}

		user, _ = h.firestoreService.GetUser(userID)
	}

	c.JSON(http.StatusOK, user)
}

// UpdateProfile updates the current user's profile
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
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
	delete(updates, "created_at")

	// If this is a new user signup with artisan profile, update role
	if artisanProfile, ok := updates["artisan_profile"].(map[string]interface{}); ok && artisanProfile != nil {
		updates["role"] = "artisan"
	}

	// Update user in Firestore
	err = h.firestoreService.UpdateUser(userID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	// Get updated user
	user, err := h.firestoreService.GetUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetAllUsers returns all users (admin only)
func (h *AuthHandler) GetAllUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	users, total, err := h.firestoreService.GetAllUsers(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
			"has_next":    page < totalPages,
			"has_prev":    page > 1,
		},
	})
}

// UpdateUserRole updates a user's role (admin only)
func (h *AuthHandler) UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var request struct {
		Role string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate role
	validRoles := []string{"user", "artisan", "admin"}
	isValidRole := false
	for _, role := range validRoles {
		if request.Role == role {
			isValidRole = true
			break
		}
	}

	if !isValidRole {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	// Update role in Firebase Auth custom claims
	claims := map[string]interface{}{
		"role": request.Role,
	}

	err := h.authClient.SetCustomUserClaims(c.Request.Context(), userID, claims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role in Firebase"})
		return
	}

	// Update role in Firestore
	updates := map[string]interface{}{
		"role": request.Role,
	}

	err = h.firestoreService.UpdateUser(userID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User role updated successfully",
		"user_id": userID,
		"role":    request.Role,
	})
}

// DeleteUser deletes a user (admin only)
func (h *AuthHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Prevent admin from deleting themselves
	currentUserID, _ := middleware.GetUserID(c)
	if userID == currentUserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot delete your own account"})
		return
	}

	// Delete from Firebase Auth
	err := h.authClient.DeleteUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user from Firebase"})
		return
	}

	// Delete from Firestore
	err = h.firestoreService.DeleteUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user from database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
