package database

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

type DB struct {
	Firestore *firestore.Client
	Auth      *auth.Client
	ctx       context.Context
}

func NewFirebaseDB(ctx context.Context, projectID, credentialsPath string) (*DB, error) {
	var opt option.ClientOption
	if credentialsPath != "" {
		opt = option.WithCredentialsFile(credentialsPath)
	}

	// Initialize Firebase app
	config := &firebase.Config{ProjectID: projectID}
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		return nil, err
	}

	// Initialize Firestore client
	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		return nil, err
	}

	// Initialize Auth client
	authClient, err := app.Auth(ctx)
	if err != nil {
		return nil, err
	}

	log.Printf("Connected to Firebase project: %s", projectID)

	return &DB{
		Firestore: firestoreClient,
		Auth:      authClient,
		ctx:       ctx,
	}, nil
}

func (db *DB) Close() error {
	return db.Firestore.Close()
}

// Collection names constants
const (
	UsersCollection      = "users"
	ProductsCollection   = "products"
	OrdersCollection     = "orders"
	ReviewsCollection    = "reviews"
	CartsCollection      = "carts"
	FollowsCollection    = "follows"
	CategoriesCollection = "categories"
	AnalyticsCollection  = "analytics"
)

// Helper methods for common operations

func (db *DB) GetCollection(name string) *firestore.CollectionRef {
	return db.Firestore.Collection(name)
}

func (db *DB) Transaction(ctx context.Context, fn func(context.Context, *firestore.Transaction) error) error {
	return db.Firestore.RunTransaction(ctx, fn)
}

func (db *DB) Batch() *firestore.WriteBatch {
	return db.Firestore.Batch()
}

// Pagination helper
type PaginationOptions struct {
	Limit      int
	StartAfter interface{}
	OrderBy    string
	Direction  firestore.Direction
}

func (p *PaginationOptions) Apply(query firestore.Query) firestore.Query {
	if p.OrderBy != "" {
		query = query.OrderBy(p.OrderBy, p.Direction)
	}

	if p.StartAfter != nil {
		query = query.StartAfter(p.StartAfter)
	}

	if p.Limit > 0 {
		query = query.Limit(p.Limit)
	}

	return query
}
