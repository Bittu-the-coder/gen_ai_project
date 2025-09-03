package handlers

import (
	"net/http"
	"strconv"

	"voicecraft-market/internal/middleware"
	"voicecraft-market/internal/models"
	"voicecraft-market/internal/services"

	"github.com/gin-gonic/gin"
)

type OrderHandler struct {
	firestoreService    *services.FirestoreService
	notificationService *services.NotificationService
}

func NewOrderHandler(firestoreService *services.FirestoreService, notificationService *services.NotificationService) *OrderHandler {
	return &OrderHandler{
		firestoreService:    firestoreService,
		notificationService: notificationService,
	}
}

// GetUserOrders retrieves orders for the authenticated user
func (h *OrderHandler) GetUserOrders(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Build filter conditions
	filters := map[string]interface{}{
		"user_id": userID,
	}
	if status != "" {
		filters["status"] = status
	}

	orders, total, err := h.firestoreService.GetOrdersWithFilters(filters, "created_at", "desc", limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"orders": orders,
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

// GetOrder retrieves a specific order
func (h *OrderHandler) GetOrder(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	orderID := c.Param("id")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
		return
	}

	order, err := h.firestoreService.GetOrder(orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if user owns this order or is admin
	if order.UserID != userID && !middleware.IsAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only view your own orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order": order})
}

// CreateOrder creates a new order
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if len(order.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order items are required"})
		return
	}

	// Set user ID and status
	order.UserID = userID
	order.Status = "pending"

	// Calculate total amount
	var totalAmount float64
	for i, item := range order.Items {
		// Get product to verify price and availability
		product, err := h.firestoreService.GetProduct(item.ProductID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found: " + item.ProductID})
			return
		}

		if product.Stock < item.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock for product: " + product.Name})
			return
		}

		// Set correct price from product
		order.Items[i].Price = product.Price
		order.Items[i].ProductName = product.Name
		totalAmount += product.Price * float64(item.Quantity)
	}

	order.TotalAmount = totalAmount

	// Create order in Firestore
	orderID, err := h.firestoreService.CreateOrder(&order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	order.ID = orderID

	// Update product stock
	for _, item := range order.Items {
		err := h.firestoreService.UpdateProductStock(item.ProductID, -item.Quantity)
		if err != nil {
			// Log error but don't fail the order creation
			// In production, this should be handled with transactions
			// TODO: Implement proper transaction handling
		}
	}

	// Send notification to user
	// TODO: Get user's FCM token and send notification

	c.JSON(http.StatusCreated, gin.H{"order": order})
}

// CancelOrder cancels an order
func (h *OrderHandler) CancelOrder(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	orderID := c.Param("id")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
		return
	}

	order, err := h.firestoreService.GetOrder(orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if user owns this order
	if order.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only cancel your own orders"})
		return
	}

	// Check if order can be cancelled
	if order.Status != "pending" && order.Status != "confirmed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order cannot be cancelled"})
		return
	}

	// Update order status
	updates := map[string]interface{}{
		"status": "cancelled",
	}

	err = h.firestoreService.UpdateOrder(orderID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel order"})
		return
	}

	// Restore product stock
	for _, item := range order.Items {
		err := h.firestoreService.UpdateProductStock(item.ProductID, item.Quantity)
		if err != nil {
			// Log error but don't fail the cancellation
			// TODO: Implement proper transaction handling
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order cancelled successfully"})
}

// GetArtisanOrders retrieves orders for the authenticated artisan
func (h *OrderHandler) GetArtisanOrders(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	status := c.Query("status")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	// Get orders that contain products from this artisan
	orders, total, err := h.firestoreService.GetOrdersByArtisan(userID, status, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch orders"})
		return
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(http.StatusOK, gin.H{
		"orders": orders,
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

// UpdateOrderStatus updates an order's status (artisan only)
func (h *OrderHandler) UpdateOrderStatus(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		return
	}

	orderID := c.Param("id")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
		return
	}

	var request struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate status
	validStatuses := []string{"pending", "confirmed", "processing", "shipped", "delivered", "cancelled"}
	isValidStatus := false
	for _, status := range validStatuses {
		if request.Status == status {
			isValidStatus = true
			break
		}
	}

	if !isValidStatus {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	order, err := h.firestoreService.GetOrder(orderID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if artisan has products in this order
	hasProduct := false
	for _, item := range order.Items {
		product, err := h.firestoreService.GetProduct(item.ProductID)
		if err == nil && product.ArtisanID == userID {
			hasProduct = true
			break
		}
	}

	if !hasProduct && !middleware.IsAdmin(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update orders containing your products"})
		return
	}

	// Update order status
	updates := map[string]interface{}{
		"status": request.Status,
	}

	err = h.firestoreService.UpdateOrder(orderID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	// Send notification to user
	// TODO: Get user's FCM token and send notification

	c.JSON(http.StatusOK, gin.H{
		"message":  "Order status updated successfully",
		"order_id": orderID,
		"status":   request.Status,
	})
}
