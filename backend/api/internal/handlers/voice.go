package handlers

import (
	"log"
	"net/http"
	"time"

	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/services"

	"github.com/gin-gonic/gin"
)

type VoiceHandler struct {
	speechService    *services.SpeechService
	aiService        *services.AIService
	firestoreService *services.FirestoreService
	storageService   *services.StorageService
}

func NewVoiceHandler(speechService *services.SpeechService, aiService *services.AIService, firestoreService *services.FirestoreService, storageService *services.StorageService) *VoiceHandler {
	return &VoiceHandler{
		speechService:    speechService,
		aiService:        aiService,
		firestoreService: firestoreService,
		storageService:   storageService,
	}
}

// TranscribeAudio converts audio to text
func (h *VoiceHandler) TranscribeAudio(c *gin.Context) {
	// Handle multipart form upload
	file, header, err := c.Request.FormFile("audio")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file is required"})
		return
	}
	defer file.Close()

	// Validate file type
	allowedTypes := []string{"mp3", "wav", "m4a", "flac", "webm"}
	if !h.storageService.ValidateFileType(header.Filename, allowedTypes) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid audio file type"})
		return
	}

	// Convert to bytes
	audioData := make([]byte, header.Size)
	_, err = file.Read(audioData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read audio file"})
		return
	}

	// Transcribe audio
	text, confidence, err := h.speechService.TranscribeAudio(audioData, header.Header.Get("Content-Type"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to transcribe audio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"text":       text,
		"confidence": confidence,
	})
}

// GenerateProduct generates product listing from voice/text description
func (h *VoiceHandler) GenerateProduct(c *gin.Context) {
	var request struct {
		Text     string `json:"text,omitempty"`
		AudioURL string `json:"audio_url,omitempty"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var description string

	// If audio URL is provided, transcribe it first
	if request.AudioURL != "" {
		// Download audio file
		audioData, err := h.storageService.DownloadFile(request.AudioURL, "")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to download audio file"})
			return
		}

		// Transcribe audio
		text, _, err := h.speechService.TranscribeAudio(audioData, "audio/mp3")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to transcribe audio"})
			return
		}
		description = text
	} else if request.Text != "" {
		description = request.Text
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Either text or audio_url is required"})
		return
	}

	// Generate product details using AI
	productInfo, err := h.aiService.GenerateProductListing(description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate product listing"})
		return
	}

	// Save as draft if user is authenticated
	if middleware.IsAuthenticated(c) {
		userID, _ := middleware.GetUserID(c)

		// Save as draft product
		draftData := map[string]interface{}{
			"user_id":     userID,
			"description": description,
			"generated":   productInfo,
			"status":      "draft",
			"created_at":  time.Now(),
		}

		_, err = h.firestoreService.CreateDocument("product_drafts", draftData)
		if err != nil {
			// Log error but don't fail the request
			log.Printf("Failed to save draft: %v", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"original_text": description,
		"product":       productInfo,
	})
}
