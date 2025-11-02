package handlers

import (
	"net/http"
	"strconv"

	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/models"
	"voicecraft-market/internal/services"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	firestoreService *services.FirestoreService
	storageService   *services.StorageService
	aiService        *services.VertexAIService
}

func NewProductHandler(firestoreService *services.FirestoreService, storageService *services.StorageService, aiService *services.VertexAIService) *ProductHandler {
	return &ProductHandler{
		firestoreService: firestoreService,
		storageService:   storageService,
		aiService:        aiService,
	}
}

// GetProducts retrieves products with pagination and filters
func (h *ProductHandler) GetProducts(c *gin.Context) {
	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	category := c.Query("category")
	artisanID := c.Query("artisan_id")
	search := c.Query("search")
	sortBy := c.DefaultQuery("sort_by", "created_at")
	sortOrder := c.DefaultQuery("sort_order", "desc")

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
		filters["category"] = category
	}
	if artisanID != "" {
		filters["artisan_id"] = artisanID
	}
	if search != "" {
		// For search, we'll implement text search in Firestore
		filters["search"] = search
	}

	// Get products from Firestore
	products, total, err := h.firestoreService.GetProductsWithFilters(filters, sortBy, sortOrder, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	// Calculate pagination info
	totalPages := (total + limit - 1) / limit
	hasNext := page < totalPages
	hasPrev := page > 1

	c.JSON(http.StatusOK, gin.H{
		"products": products,
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

// GetProduct retrieves a single product by ID
func (h *ProductHandler) GetProduct(c *gin.Context) {
	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	product, err := h.firestoreService.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Increment view count (async)
	go h.firestoreService.IncrementProductViews(productID)

	c.JSON(http.StatusOK, gin.H{"product": product})
}

// CreateProduct creates a new product (artisan only)
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if product.Title == "" || product.Description == "" || product.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name, description, and price are required"})
		return
	}

	// Set artisan ID from authenticated user
	product.ArtisanID = userID

	// Validate and set category
	validCategories := []string{"pottery", "textiles", "jewelry", "woodwork", "metalwork", "glass", "leather", "other"}
	isValidCategory := false
	for _, cat := range validCategories {
		if product.Category == cat {
			isValidCategory = true
			break
		}
	}
	if !isValidCategory {
		product.Category = "other"
	}

	// Create product in Firestore
	productID, err := h.firestoreService.CreateProduct(&product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	product.ID = productID

	c.JSON(http.StatusCreated, gin.H{"product": product})
}

// UpdateProduct updates an existing product (artisan only, own products)
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	// Check if product exists and belongs to the artisan
	existingProduct, err := h.firestoreService.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if existingProduct.ArtisanID != userID && !middleware.IsAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own products"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Prevent updating certain fields
	delete(updates, "id")
	delete(updates, "artisan_id")
	delete(updates, "created_at")

	// Update product in Firestore
	err = h.firestoreService.UpdateProduct(productID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	// Get updated product
	updatedProduct, err := h.firestoreService.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": updatedProduct})
}

// DeleteProduct deletes a product (artisan only, own products)
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	// Check if product exists and belongs to the artisan
	existingProduct, err := h.firestoreService.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if existingProduct.ArtisanID != userID && !middleware.IsAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own products"})
		return
	}

	// Delete product from Firestore
	err = h.firestoreService.DeleteProduct(productID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	// TODO: Delete associated images from storage

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// UploadProductImages handles product image uploads
func (h *ProductHandler) UploadProductImages(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
		return
	}

	// Check if product exists and belongs to the artisan
	existingProduct, err := h.firestoreService.GetProduct(productID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if existingProduct.ArtisanID != userID && !middleware.IsAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only upload images for your own products"})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No images provided"})
		return
	}

	var uploadedImages []string
	allowedTypes := []string{"jpeg", "jpg", "png", "webp"}

	for _, fileHeader := range files {
		// Validate file type
		if !h.storageService.ValidateFileType(fileHeader.Filename, allowedTypes) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only JPEG, PNG, and WebP are allowed"})
			return
		}

		// Open file
		file, err := fileHeader.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
			return
		}

		// Upload to storage
		result, err := h.storageService.UploadImage(file, fileHeader, userID)
		if err != nil {
			file.Close()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
			return
		}

		uploadedImages = append(uploadedImages, result.URL)
		file.Close()
	}

	// Update product with new images
	updates := map[string]interface{}{
		"images": uploadedImages,
	}

	err = h.firestoreService.UpdateProduct(productID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product with images"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Images uploaded successfully",
		"images":  uploadedImages,
	})
}

// GetProductsByArtisan retrieves all products by a specific artisan
func (h *ProductHandler) GetProductsByArtisan(c *gin.Context) {
	artisanID := c.Param("artisan_id")
	if artisanID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Artisan ID is required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	filters := map[string]interface{}{
		"artisan_id": artisanID,
	}

	products, total, err := h.firestoreService.GetProductsWithFilters(filters, "created_at", "desc", limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"products": products,
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

// SearchProducts searches products by text
func (h *ProductHandler) SearchProducts(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// TODO: Implement AI semantic search
	// For now, use basic text search
	filters := map[string]interface{}{
		"search": query,
	}

	products, total, err := h.firestoreService.GetProductsWithFilters(filters, "created_at", "desc", limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search products"})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
			"has_next":    page < totalPages,
			"has_prev":    page > 1,
		},
		"search_type": "text",
	})
}
