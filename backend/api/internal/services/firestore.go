package services

import (
	"context"
	"fmt"
	"time"
	"voicecraft-market/internal/models"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

type FirestoreService struct {
	client *firestore.Client
	ctx    context.Context
}

func NewFirestoreService(ctx context.Context, projectID string) (*FirestoreService, error) {
	client, err := firestore.NewClient(ctx, projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to create Firestore client: %v", err)
	}

	return &FirestoreService{
		client: client,
		ctx:    ctx,
	}, nil
}

func (fs *FirestoreService) Close() error {
	return fs.client.Close()
}

// Collection names
const (
	UsersCollection    = "users"
	ProductsCollection = "products"
	OrdersCollection   = "orders"
	ArtisansCollection = "artisans"
	ReviewsCollection  = "reviews"
	CartsCollection    = "carts"
	DraftsCollection   = "product_drafts"
)

// Generic CRUD operations

func (fs *FirestoreService) CreateDocument(collection string, data interface{}) (string, error) {
	doc, _, err := fs.client.Collection(collection).Add(fs.ctx, data)
	if err != nil {
		return "", err
	}
	return doc.ID, nil
}

func (fs *FirestoreService) GetDocument(collection, id string, dest interface{}) error {
	doc, err := fs.client.Collection(collection).Doc(id).Get(fs.ctx)
	if err != nil {
		return err
	}
	return doc.DataTo(dest)
}

func (fs *FirestoreService) UpdateDocument(collection, id string, updates map[string]interface{}) error {
	updates["updated_at"] = time.Now()
	_, err := fs.client.Collection(collection).Doc(id).Update(fs.ctx, []firestore.Update{
		{Path: "updated_at", Value: updates["updated_at"]},
	})

	// Convert map to firestore updates
	var firestoreUpdates []firestore.Update
	for key, value := range updates {
		firestoreUpdates = append(firestoreUpdates, firestore.Update{
			Path:  key,
			Value: value,
		})
	}

	_, err = fs.client.Collection(collection).Doc(id).Update(fs.ctx, firestoreUpdates)
	return err
}

func (fs *FirestoreService) DeleteDocument(collection, id string) error {
	_, err := fs.client.Collection(collection).Doc(id).Delete(fs.ctx)
	return err
}

// User operations

func (fs *FirestoreService) CreateUser(user *models.User) (string, error) {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	return fs.CreateDocument(UsersCollection, user)
}

func (fs *FirestoreService) GetUser(userID string) (*models.User, error) {
	var user models.User
	err := fs.GetDocument(UsersCollection, userID, &user)
	if err != nil {
		return nil, err
	}
	user.ID = userID
	return &user, nil
}

func (fs *FirestoreService) UpdateUser(userID string, updates map[string]interface{}) error {
	return fs.UpdateDocument(UsersCollection, userID, updates)
}

func (fs *FirestoreService) DeleteUser(userID string) error {
	return fs.DeleteDocument(UsersCollection, userID)
}

func (fs *FirestoreService) GetAllUsers(limit, offset int) ([]models.User, int, error) {
	query := fs.client.Collection(UsersCollection).OrderBy("created_at", firestore.Desc)

	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}

	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var users []models.User
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, 0, err
		}

		var user models.User
		if err := doc.DataTo(&user); err != nil {
			continue
		}
		user.ID = doc.Ref.ID
		users = append(users, user)
	}

	// Get total count (simplified - in production you'd want to optimize this)
	totalQuery := fs.client.Collection(UsersCollection)
	totalDocs, err := totalQuery.Documents(fs.ctx).GetAll()
	if err != nil {
		return users, len(users), nil // Return what we have if count fails
	}

	return users, len(totalDocs), nil
}

// Product operations

func (fs *FirestoreService) CreateProduct(product *models.Product) (string, error) {
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()
	return fs.CreateDocument(ProductsCollection, product)
}

func (fs *FirestoreService) GetProduct(productID string) (*models.Product, error) {
	var product models.Product
	err := fs.GetDocument(ProductsCollection, productID, &product)
	if err != nil {
		return nil, err
	}
	product.ID = productID
	return &product, nil
}

func (fs *FirestoreService) UpdateProduct(productID string, updates map[string]interface{}) error {
	return fs.UpdateDocument(ProductsCollection, productID, updates)
}

func (fs *FirestoreService) DeleteProduct(productID string) error {
	return fs.DeleteDocument(ProductsCollection, productID)
}

func (fs *FirestoreService) GetProductsWithFilters(filters map[string]interface{}, sortBy, sortOrder string, limit, offset int) ([]models.Product, int, error) {
	query := fs.client.Collection(ProductsCollection).Query

	// Apply filters
	for key, value := range filters {
		if key == "search" {
			// For search, you'd typically use a more sophisticated approach
			// This is a simplified version
			continue
		}
		query = query.Where(key, "==", value)
	}

	// Apply sorting
	direction := firestore.Asc
	if sortOrder == "desc" {
		direction = firestore.Desc
	}
	query = query.OrderBy(sortBy, direction)

	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}

	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var products []models.Product
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, 0, err
		}

		var product models.Product
		if err := doc.DataTo(&product); err != nil {
			continue
		}
		product.ID = doc.Ref.ID
		products = append(products, product)
	}

	// Get total count (simplified)
	totalQuery := fs.client.Collection(ProductsCollection).Query
	for key, value := range filters {
		if key != "search" {
			totalQuery = totalQuery.Where(key, "==", value)
		}
	}
	totalDocs, err := totalQuery.Documents(fs.ctx).GetAll()
	total := len(products)
	if err == nil {
		total = len(totalDocs)
	}

	return products, total, nil
}

func (fs *FirestoreService) IncrementProductViews(productID string) error {
	return fs.UpdateDocument(ProductsCollection, productID, map[string]interface{}{
		"views": firestore.Increment(1),
	})
}

func (fs *FirestoreService) UpdateProductStock(productID string, stockChange int) error {
	return fs.UpdateDocument(ProductsCollection, productID, map[string]interface{}{
		"stock": firestore.Increment(stockChange),
	})
}

// Artisan operations

func (fs *FirestoreService) CreateArtisan(artisan *models.ArtisanProfile) (string, error) {
	artisan.CreatedAt = time.Now()
	artisan.UpdatedAt = time.Now()
	return fs.CreateDocument(ArtisansCollection, artisan)
}

func (fs *FirestoreService) GetArtisan(artisanID string) (*models.ArtisanProfile, error) {
	var artisan models.ArtisanProfile
	err := fs.GetDocument(ArtisansCollection, artisanID, &artisan)
	if err != nil {
		return nil, err
	}
	artisan.ID = artisanID
	return &artisan, nil
}

func (fs *FirestoreService) UpdateArtisan(artisanID string, updates map[string]interface{}) error {
	return fs.UpdateDocument(ArtisansCollection, artisanID, updates)
}

func (fs *FirestoreService) GetArtisansWithFilters(filters map[string]interface{}, sortBy, sortOrder string, limit, offset int) ([]models.ArtisanProfile, int, error) {
	query := fs.client.Collection(ArtisansCollection).Query

	// Apply filters
	for key, value := range filters {
		if key == "search" {
			continue // Implement text search separately
		}
		if key == "specializations" {
			query = query.Where("specializations", "array-contains", value)
		} else {
			query = query.Where(key, "==", value)
		}
	}

	// Apply sorting
	direction := firestore.Asc
	if sortOrder == "desc" {
		direction = firestore.Desc
	}
	query = query.OrderBy(sortBy, direction)

	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}

	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var artisans []models.ArtisanProfile
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, 0, err
		}

		var artisan models.ArtisanProfile
		if err := doc.DataTo(&artisan); err != nil {
			continue
		}
		artisan.ID = doc.Ref.ID
		artisans = append(artisans, artisan)
	}

	// Get total count
	totalQuery := fs.client.Collection(ArtisansCollection)
	totalDocs, err := totalQuery.Documents(fs.ctx).GetAll()
	total := len(artisans)
	if err == nil {
		total = len(totalDocs)
	}

	return artisans, total, nil
}

// Order operations

func (fs *FirestoreService) CreateOrder(order *models.Order) (string, error) {
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()
	return fs.CreateDocument(OrdersCollection, order)
}

func (fs *FirestoreService) GetOrder(orderID string) (*models.Order, error) {
	var order models.Order
	err := fs.GetDocument(OrdersCollection, orderID, &order)
	if err != nil {
		return nil, err
	}
	order.ID = orderID
	return &order, nil
}

func (fs *FirestoreService) UpdateOrder(orderID string, updates map[string]interface{}) error {
	return fs.UpdateDocument(OrdersCollection, orderID, updates)
}

func (fs *FirestoreService) GetOrdersWithFilters(filters map[string]interface{}, sortBy, sortOrder string, limit, offset int) ([]models.Order, int, error) {
	var query firestore.Query = fs.client.Collection(OrdersCollection).Query

	// Apply filters
	for key, value := range filters {
		query = query.Where(key, "==", value)
	}

	// Apply sorting
	direction := firestore.Asc
	if sortOrder == "desc" {
		direction = firestore.Desc
	}
	query = query.OrderBy(sortBy, direction)

	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}

	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var orders []models.Order
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, 0, err
		}

		var order models.Order
		if err := doc.DataTo(&order); err != nil {
			continue
		}
		order.ID = doc.Ref.ID
		orders = append(orders, order)
	}

	// Get total count
	var totalQuery firestore.Query = fs.client.Collection(OrdersCollection).Query
	for key, value := range filters {
		totalQuery = totalQuery.Where(key, "==", value)
	}
	totalDocs, err := totalQuery.Documents(fs.ctx).GetAll()
	total := len(orders)
	if err == nil {
		total = len(totalDocs)
	}

	return orders, total, nil
}

func (fs *FirestoreService) GetOrdersByArtisan(artisanID, status string, limit, offset int) ([]models.Order, int, error) {
	// This is a complex query that requires getting all orders and filtering by artisan products
	// In a production system, you'd want to optimize this with proper indexing or denormalization

	query := fs.client.Collection(OrdersCollection).OrderBy("created_at", firestore.Desc)

	if status != "" {
		query = query.Where("status", "==", status)
	}

	if offset > 0 {
		query = query.Offset(offset)
	}
	if limit > 0 {
		query = query.Limit(limit * 3) // Get more to filter locally
	}

	iter := query.Documents(fs.ctx)
	defer iter.Stop()

	var artisanOrders []models.Order
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, 0, err
		}

		var order models.Order
		if err := doc.DataTo(&order); err != nil {
			continue
		}
		order.ID = doc.Ref.ID

		// Check if any order items belong to this artisan
		hasArtisanProduct := false
		for _, item := range order.Items {
			product, err := fs.GetProduct(item.ProductID)
			if err == nil && product.ArtisanID == artisanID {
				hasArtisanProduct = true
				break
			}
		}

		if hasArtisanProduct {
			artisanOrders = append(artisanOrders, order)
		}

		if len(artisanOrders) >= limit {
			break
		}
	}

	return artisanOrders, len(artisanOrders), nil
}

// Utility methods

func (fs *FirestoreService) BatchWrite(operations []func(*firestore.WriteBatch)) error {
	batch := fs.client.Batch()

	for _, op := range operations {
		op(batch)
	}

	_, err := batch.Commit(fs.ctx)
	return err
}

func (fs *FirestoreService) RunTransaction(fn func(context.Context, *firestore.Transaction) error) error {
	return fs.client.RunTransaction(fs.ctx, fn)
}
