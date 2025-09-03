package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware verifies Firebase ID tokens
func AuthMiddleware(authClient *auth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		idToken := tokenParts[1]

		// Verify the ID token
		token, err := authClient.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Add user info to context
		c.Set("user_id", token.UID)
		c.Set("user_email", token.Claims["email"])
		c.Set("user_verified", token.Claims["email_verified"])
		c.Set("firebase_token", token)

		c.Next()
	}
}

// OptionalAuthMiddleware verifies Firebase ID tokens but doesn't require them
func OptionalAuthMiddleware(authClient *auth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		// Extract token from "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.Next()
			return
		}

		idToken := tokenParts[1]

		// Verify the ID token
		token, err := authClient.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.Next()
			return
		}

		// Add user info to context
		c.Set("user_id", token.UID)
		c.Set("user_email", token.Claims["email"])
		c.Set("user_verified", token.Claims["email_verified"])
		c.Set("firebase_token", token)

		c.Next()
	}
}

// AdminMiddleware checks if user has admin role
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get Firebase token from context
		token, exists := c.Get("firebase_token")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		firebaseToken := token.(*auth.Token)

		// Check for admin role in custom claims
		role, ok := firebaseToken.Claims["role"]
		if !ok || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// ArtisanMiddleware checks if user has artisan role or is accessing their own resources
func ArtisanMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get Firebase token from context
		token, exists := c.Get("firebase_token")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		firebaseToken := token.(*auth.Token)
		userID := firebaseToken.UID

		// Check for artisan role in custom claims
		role, hasRole := firebaseToken.Claims["role"]

		// Allow if user is an artisan or admin
		if hasRole && (role == "artisan" || role == "admin") {
			c.Set("artisan_id", userID)
			c.Next()
			return
		}

		// Check if accessing own artisan profile
		artisanID := c.Param("artisan_id")
		if artisanID != "" && artisanID == userID {
			c.Set("artisan_id", userID)
			c.Next()
			return
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Artisan access required"})
		c.Abort()
	}
}

// GetUserID helper function to extract user ID from context
func GetUserID(c *gin.Context) (string, error) {
	userID, exists := c.Get("user_id")
	if !exists {
		return "", fmt.Errorf("user not authenticated")
	}

	return userID.(string), nil
}

// GetUserEmail helper function to extract user email from context
func GetUserEmail(c *gin.Context) (string, error) {
	email, exists := c.Get("user_email")
	if !exists {
		return "", fmt.Errorf("user email not found")
	}

	if email == nil {
		return "", fmt.Errorf("user email is nil")
	}

	return email.(string), nil
}

// IsAuthenticated helper function to check if user is authenticated
func IsAuthenticated(c *gin.Context) bool {
	_, exists := c.Get("user_id")
	return exists
}

// IsAdmin helper function to check if user is admin
func IsAdmin(c *gin.Context) bool {
	token, exists := c.Get("firebase_token")
	if !exists {
		return false
	}

	firebaseToken := token.(*auth.Token)
	role, ok := firebaseToken.Claims["role"]
	return ok && role == "admin"
}

// IsArtisan helper function to check if user is artisan
func IsArtisan(c *gin.Context) bool {
	token, exists := c.Get("firebase_token")
	if !exists {
		return false
	}

	firebaseToken := token.(*auth.Token)
	role, ok := firebaseToken.Claims["role"]
	return ok && (role == "artisan" || role == "admin")
}
