package models

import (
	"time"
)

// User represents both artisans and buyers
type User struct {
	ID         string    `firestore:"id" json:"id"`
	Email      string    `firestore:"email" json:"email"`
	Name       string    `firestore:"name" json:"name"`
	Phone      string    `firestore:"phone,omitempty" json:"phone,omitempty"`
	Role       UserRole  `firestore:"role" json:"role"`
	Status     string    `firestore:"status" json:"status"` // active, suspended, pending
	CreatedAt  time.Time `firestore:"created_at" json:"created_at"`
	UpdatedAt  time.Time `firestore:"updated_at" json:"updated_at"`
	ProfileURL string    `firestore:"profile_url,omitempty" json:"profile_url,omitempty"`
	Language   string    `firestore:"language" json:"language"` // english, hindi, hinglish

	// Artisan-specific fields
	ArtisanProfile *ArtisanProfile `firestore:"artisan_profile,omitempty" json:"artisan_profile,omitempty"`
}

type UserRole string

const (
	RoleArtisan UserRole = "artisan"
	RoleBuyer   UserRole = "buyer"
	RoleAdmin   UserRole = "admin"
)

// ArtisanProfile contains artisan-specific information
type ArtisanProfile struct {
	Craft           string            `firestore:"craft" json:"craft"`
	Location        string            `firestore:"location" json:"location"`
	YearsExperience int               `firestore:"years_experience" json:"years_experience"`
	Specialties     []string          `firestore:"specialties" json:"specialties"`
	Bio             string            `firestore:"bio" json:"bio"`
	Story           string            `firestore:"story" json:"story"`
	CoverImageURL   string            `firestore:"cover_image_url,omitempty" json:"cover_image_url,omitempty"`
	SocialLinks     map[string]string `firestore:"social_links,omitempty" json:"social_links,omitempty"`
	Achievements    []string          `firestore:"achievements,omitempty" json:"achievements,omitempty"`
	IsVerified      bool              `firestore:"is_verified" json:"is_verified"`
	Rating          float64           `firestore:"rating" json:"rating"`
	ReviewCount     int               `firestore:"review_count" json:"review_count"`
	FollowerCount   int               `firestore:"follower_count" json:"follower_count"`
	TotalSales      int               `firestore:"total_sales" json:"total_sales"`
}

// Product represents an artisan's product
type Product struct {
	ID           string            `firestore:"id" json:"id"`
	ArtisanID    string            `firestore:"artisan_id" json:"artisan_id"`
	Title        string            `firestore:"title" json:"title"`
	Description  string            `firestore:"description" json:"description"`
	Price        float64           `firestore:"price" json:"price"`
	Currency     string            `firestore:"currency" json:"currency"`
	Category     string            `firestore:"category" json:"category"`
	Images       []string          `firestore:"images" json:"images"`
	VideoURL     string            `firestore:"video_url,omitempty" json:"video_url,omitempty"`
	Status       ProductStatus     `firestore:"status" json:"status"`
	Stock        int               `firestore:"stock" json:"stock"`
	SKU          string            `firestore:"sku,omitempty" json:"sku,omitempty"`
	Weight       float64           `firestore:"weight,omitempty" json:"weight,omitempty"`
	Dimensions   ProductDimensions `firestore:"dimensions,omitempty" json:"dimensions,omitempty"`
	Materials    []string          `firestore:"materials,omitempty" json:"materials,omitempty"`
	CraftingTime string            `firestore:"crafting_time,omitempty" json:"crafting_time,omitempty"`
	CreatedAt    time.Time         `firestore:"created_at" json:"created_at"`
	UpdatedAt    time.Time         `firestore:"updated_at" json:"updated_at"`
	Tags         []string          `firestore:"tags,omitempty" json:"tags,omitempty"`
	SEOKeywords  []string          `firestore:"seo_keywords,omitempty" json:"seo_keywords,omitempty"`

	// Voice-to-Shop specific fields
	VoiceStory         *VoiceStory         `firestore:"voice_story,omitempty" json:"voice_story,omitempty"`
	AIGeneratedContent *AIGeneratedContent `firestore:"ai_generated_content,omitempty" json:"ai_generated_content,omitempty"`

	// Analytics
	ViewCount  int `firestore:"view_count" json:"view_count"`
	LikeCount  int `firestore:"like_count" json:"like_count"`
	ShareCount int `firestore:"share_count" json:"share_count"`
	SalesCount int `firestore:"sales_count" json:"sales_count"`
}

type ProductStatus string

const (
	ProductStatusDraft      ProductStatus = "draft"
	ProductStatusActive     ProductStatus = "active"
	ProductStatusOutOfStock ProductStatus = "out_of_stock"
	ProductStatusArchived   ProductStatus = "archived"
)

type ProductDimensions struct {
	Length float64 `firestore:"length" json:"length"`
	Width  float64 `firestore:"width" json:"width"`
	Height float64 `firestore:"height" json:"height"`
	Unit   string  `firestore:"unit" json:"unit"` // cm, inch, etc.
}

// VoiceStory contains the original voice recording and its metadata
type VoiceStory struct {
	AudioURL     string            `firestore:"audio_url" json:"audio_url"`
	Duration     float64           `firestore:"duration" json:"duration"` // in seconds
	Transcript   string            `firestore:"transcript" json:"transcript"`
	Language     string            `firestore:"language" json:"language"`
	Quality      string            `firestore:"quality" json:"quality"` // high, medium, low
	ProcessedAt  time.Time         `firestore:"processed_at" json:"processed_at"`
	Translations map[string]string `firestore:"translations,omitempty" json:"translations,omitempty"`
}

// AIGeneratedContent contains all AI-generated content for the product
type AIGeneratedContent struct {
	ProductTitle    string               `firestore:"product_title" json:"product_title"`
	Description     string               `firestore:"description" json:"description"`
	ArtisanStory    map[string]string    `firestore:"artisan_story" json:"artisan_story"` // language -> story
	SuggestedPrice  float64              `firestore:"suggested_price" json:"suggested_price"`
	SEOKeywords     []string             `firestore:"seo_keywords" json:"seo_keywords"`
	Hashtags        []string             `firestore:"hashtags" json:"hashtags"`
	SocialMedia     SocialMediaContent   `firestore:"social_media" json:"social_media"`
	WhatsAppCatalog WhatsAppCatalogEntry `firestore:"whatsapp_catalog" json:"whatsapp_catalog"`
	FAQ             []FAQItem            `firestore:"faq,omitempty" json:"faq,omitempty"`
	GeneratedAt     time.Time            `firestore:"generated_at" json:"generated_at"`
	ModelVersion    string               `firestore:"model_version" json:"model_version"`
	Confidence      float64              `firestore:"confidence" json:"confidence"`
}

type SocialMediaContent struct {
	InstagramReels []InstagramReel `firestore:"instagram_reels" json:"instagram_reels"`
	InstagramPosts []InstagramPost `firestore:"instagram_posts" json:"instagram_posts"`
	FacebookPosts  []FacebookPost  `firestore:"facebook_posts" json:"facebook_posts"`
	TwitterPosts   []TwitterPost   `firestore:"twitter_posts" json:"twitter_posts"`
}

type InstagramReel struct {
	Script          string   `firestore:"script" json:"script"`
	Captions        []string `firestore:"captions" json:"captions"`
	Hashtags        []string `firestore:"hashtags" json:"hashtags"`
	Duration        int      `firestore:"duration" json:"duration"` // seconds
	MusicSuggestion string   `firestore:"music_suggestion,omitempty" json:"music_suggestion,omitempty"`
}

type InstagramPost struct {
	Caption     string   `firestore:"caption" json:"caption"`
	Hashtags    []string `firestore:"hashtags" json:"hashtags"`
	ImagePrompt string   `firestore:"image_prompt,omitempty" json:"image_prompt,omitempty"`
}

type FacebookPost struct {
	Content  string   `firestore:"content" json:"content"`
	Hashtags []string `firestore:"hashtags" json:"hashtags"`
}

type TwitterPost struct {
	Content  string   `firestore:"content" json:"content"`
	Hashtags []string `firestore:"hashtags" json:"hashtags"`
}

type WhatsAppCatalogEntry struct {
	Title       string `firestore:"title" json:"title"`
	Description string `firestore:"description" json:"description"`
	Price       string `firestore:"price" json:"price"`
	Currency    string `firestore:"currency" json:"currency"`
	ImageURL    string `firestore:"image_url" json:"image_url"`
	ProductURL  string `firestore:"product_url" json:"product_url"`
}

type FAQItem struct {
	Question string `firestore:"question" json:"question"`
	Answer   string `firestore:"answer" json:"answer"`
}

// Order represents a purchase order
type Order struct {
	ID              string        `firestore:"id" json:"id"`
	BuyerID         string        `firestore:"buyer_id" json:"buyer_id"`
	ArtisanID       string        `firestore:"artisan_id" json:"artisan_id"`
	Items           []OrderItem   `firestore:"items" json:"items"`
	TotalAmount     float64       `firestore:"total_amount" json:"total_amount"`
	Currency        string        `firestore:"currency" json:"currency"`
	Status          OrderStatus   `firestore:"status" json:"status"`
	PaymentStatus   string        `firestore:"payment_status" json:"payment_status"`
	PaymentID       string        `firestore:"payment_id,omitempty" json:"payment_id,omitempty"`
	ShippingAddress Address       `firestore:"shipping_address" json:"shipping_address"`
	BillingAddress  Address       `firestore:"billing_address" json:"billing_address"`
	CreatedAt       time.Time     `firestore:"created_at" json:"created_at"`
	UpdatedAt       time.Time     `firestore:"updated_at" json:"updated_at"`
	DeliveredAt     *time.Time    `firestore:"delivered_at,omitempty" json:"delivered_at,omitempty"`
	TrackingInfo    *TrackingInfo `firestore:"tracking_info,omitempty" json:"tracking_info,omitempty"`
}

type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusConfirmed  OrderStatus = "confirmed"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusShipped    OrderStatus = "shipped"
	OrderStatusDelivered  OrderStatus = "delivered"
	OrderStatusCancelled  OrderStatus = "cancelled"
	OrderStatusRefunded   OrderStatus = "refunded"
)

type OrderItem struct {
	ProductID string  `firestore:"product_id" json:"product_id"`
	Quantity  int     `firestore:"quantity" json:"quantity"`
	Price     float64 `firestore:"price" json:"price"`
	Total     float64 `firestore:"total" json:"total"`
}

type Address struct {
	Name       string `firestore:"name" json:"name"`
	Line1      string `firestore:"line1" json:"line1"`
	Line2      string `firestore:"line2,omitempty" json:"line2,omitempty"`
	City       string `firestore:"city" json:"city"`
	State      string `firestore:"state" json:"state"`
	PostalCode string `firestore:"postal_code" json:"postal_code"`
	Country    string `firestore:"country" json:"country"`
	Phone      string `firestore:"phone,omitempty" json:"phone,omitempty"`
}

type TrackingInfo struct {
	Carrier           string     `firestore:"carrier" json:"carrier"`
	TrackingNumber    string     `firestore:"tracking_number" json:"tracking_number"`
	EstimatedDelivery *time.Time `firestore:"estimated_delivery,omitempty" json:"estimated_delivery,omitempty"`
}

// Review represents product reviews
type Review struct {
	ID        string    `firestore:"id" json:"id"`
	ProductID string    `firestore:"product_id" json:"product_id"`
	ArtisanID string    `firestore:"artisan_id" json:"artisan_id"`
	BuyerID   string    `firestore:"buyer_id" json:"buyer_id"`
	OrderID   string    `firestore:"order_id" json:"order_id"`
	Rating    int       `firestore:"rating" json:"rating"` // 1-5
	Title     string    `firestore:"title,omitempty" json:"title,omitempty"`
	Comment   string    `firestore:"comment,omitempty" json:"comment,omitempty"`
	Images    []string  `firestore:"images,omitempty" json:"images,omitempty"`
	Verified  bool      `firestore:"verified" json:"verified"`
	Helpful   int       `firestore:"helpful" json:"helpful"`
	CreatedAt time.Time `firestore:"created_at" json:"created_at"`
	UpdatedAt time.Time `firestore:"updated_at" json:"updated_at"`
}

// Cart represents shopping cart
type Cart struct {
	ID        string     `firestore:"id" json:"id"`
	UserID    string     `firestore:"user_id" json:"user_id"`
	Items     []CartItem `firestore:"items" json:"items"`
	CreatedAt time.Time  `firestore:"created_at" json:"created_at"`
	UpdatedAt time.Time  `firestore:"updated_at" json:"updated_at"`
}

type CartItem struct {
	ProductID string    `firestore:"product_id" json:"product_id"`
	Quantity  int       `firestore:"quantity" json:"quantity"`
	AddedAt   time.Time `firestore:"added_at" json:"added_at"`
}

// Follow represents artisan following relationship
type Follow struct {
	ID         string    `firestore:"id" json:"id"`
	FollowerID string    `firestore:"follower_id" json:"follower_id"`
	ArtisanID  string    `firestore:"artisan_id" json:"artisan_id"`
	CreatedAt  time.Time `firestore:"created_at" json:"created_at"`
}
