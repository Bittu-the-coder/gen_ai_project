package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"firebase.google.com/go/auth"
	"firebase.google.com/go/messaging"
)

type NotificationService struct {
	authClient      *auth.Client
	messagingClient *messaging.Client
	ctx             context.Context
}

type NotificationPayload struct {
	Title    string            `json:"title"`
	Body     string            `json:"body"`
	Data     map[string]string `json:"data,omitempty"`
	ImageURL string            `json:"image_url,omitempty"`
}

type PushNotificationRequest struct {
	Token   string              `json:"token,omitempty"`
	Topic   string              `json:"topic,omitempty"`
	Tokens  []string            `json:"tokens,omitempty"`
	Payload NotificationPayload `json:"payload"`
}

func NewNotificationService(ctx context.Context, authClient *auth.Client, messagingClient *messaging.Client) *NotificationService {
	return &NotificationService{
		authClient:      authClient,
		messagingClient: messagingClient,
		ctx:             ctx,
	}
}

// SendToToken sends a notification to a specific device token
func (n *NotificationService) SendToToken(token string, payload NotificationPayload) error {
	message := &messaging.Message{
		Token: token,
		Notification: &messaging.Notification{
			Title:    payload.Title,
			Body:     payload.Body,
			ImageURL: payload.ImageURL,
		},
		Data: payload.Data,
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Icon:  "ic_notification",
				Color: "#FF6B35",
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Alert: &messaging.ApsAlert{
						Title: payload.Title,
						Body:  payload.Body,
					},
					Badge: nil,
					Sound: "default",
				},
			},
		},
		Webpush: &messaging.WebpushConfig{
			Notification: &messaging.WebpushNotification{
				Title: payload.Title,
				Body:  payload.Body,
				Icon:  "/favicon.ico",
			},
		},
	}

	response, err := n.messagingClient.Send(n.ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send notification: %v", err)
	}

	log.Printf("Successfully sent message: %s", response)
	return nil
}

// SendToTopic sends a notification to all devices subscribed to a topic
func (n *NotificationService) SendToTopic(topic string, payload NotificationPayload) error {
	message := &messaging.Message{
		Topic: topic,
		Notification: &messaging.Notification{
			Title:    payload.Title,
			Body:     payload.Body,
			ImageURL: payload.ImageURL,
		},
		Data: payload.Data,
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Icon:  "ic_notification",
				Color: "#FF6B35",
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Alert: &messaging.ApsAlert{
						Title: payload.Title,
						Body:  payload.Body,
					},
					Badge: nil,
					Sound: "default",
				},
			},
		},
	}

	response, err := n.messagingClient.Send(n.ctx, message)
	if err != nil {
		return fmt.Errorf("failed to send topic notification: %v", err)
	}

	log.Printf("Successfully sent topic message: %s", response)
	return nil
}

// SendToMultipleTokens sends notifications to multiple device tokens
func (n *NotificationService) SendToMultipleTokens(tokens []string, payload NotificationPayload) (*messaging.BatchResponse, error) {
	message := &messaging.MulticastMessage{
		Tokens: tokens,
		Notification: &messaging.Notification{
			Title:    payload.Title,
			Body:     payload.Body,
			ImageURL: payload.ImageURL,
		},
		Data: payload.Data,
		Android: &messaging.AndroidConfig{
			Notification: &messaging.AndroidNotification{
				Icon:  "ic_notification",
				Color: "#FF6B35",
			},
		},
		APNS: &messaging.APNSConfig{
			Payload: &messaging.APNSPayload{
				Aps: &messaging.Aps{
					Alert: &messaging.ApsAlert{
						Title: payload.Title,
						Body:  payload.Body,
					},
					Badge: nil,
					Sound: "default",
				},
			},
		},
	}

	response, err := n.messagingClient.SendMulticast(n.ctx, message)
	if err != nil {
		return nil, fmt.Errorf("failed to send multicast notification: %v", err)
	}

	log.Printf("Successfully sent %d messages", response.SuccessCount)
	if response.FailureCount > 0 {
		log.Printf("Failed to send %d messages", response.FailureCount)
	}

	return response, nil
}

// SubscribeToTopic subscribes device tokens to a topic
func (n *NotificationService) SubscribeToTopic(tokens []string, topic string) error {
	response, err := n.messagingClient.SubscribeToTopic(n.ctx, tokens, topic)
	if err != nil {
		return fmt.Errorf("failed to subscribe to topic: %v", err)
	}

	log.Printf("Successfully subscribed %d tokens to topic %s", len(tokens)-response.FailureCount, topic)
	return nil
}

// UnsubscribeFromTopic unsubscribes device tokens from a topic
func (n *NotificationService) UnsubscribeFromTopic(tokens []string, topic string) error {
	response, err := n.messagingClient.UnsubscribeFromTopic(n.ctx, tokens, topic)
	if err != nil {
		return fmt.Errorf("failed to unsubscribe from topic: %v", err)
	}

	log.Printf("Successfully unsubscribed %d tokens from topic %s", len(tokens)-response.FailureCount, topic)
	return nil
}

// SendOrderNotification sends order-related notifications
func (n *NotificationService) SendOrderNotification(userToken, orderID, status string) error {
	var title, body string

	switch status {
	case "confirmed":
		title = "Order Confirmed"
		body = fmt.Sprintf("Your order #%s has been confirmed and is being prepared.", orderID)
	case "shipped":
		title = "Order Shipped"
		body = fmt.Sprintf("Your order #%s has been shipped and is on its way!", orderID)
	case "delivered":
		title = "Order Delivered"
		body = fmt.Sprintf("Your order #%s has been delivered. Thank you for shopping with us!", orderID)
	case "cancelled":
		title = "Order Cancelled"
		body = fmt.Sprintf("Your order #%s has been cancelled. Please contact support if you need assistance.", orderID)
	default:
		title = "Order Update"
		body = fmt.Sprintf("Your order #%s status has been updated to: %s", orderID, status)
	}

	payload := NotificationPayload{
		Title: title,
		Body:  body,
		Data: map[string]string{
			"type":     "order",
			"order_id": orderID,
			"status":   status,
		},
	}

	return n.SendToToken(userToken, payload)
}

// SendArtisanNotification sends artisan-related notifications
func (n *NotificationService) SendArtisanNotification(userToken, artisanName, action string) error {
	var title, body string

	switch action {
	case "new_product":
		title = "New Product Available"
		body = fmt.Sprintf("%s has added a new product to their collection!", artisanName)
	case "back_in_stock":
		title = "Back in Stock"
		body = fmt.Sprintf("A product from %s that you were interested in is back in stock!", artisanName)
	case "special_offer":
		title = "Special Offer"
		body = fmt.Sprintf("%s has a special offer just for you!", artisanName)
	default:
		title = "Artisan Update"
		body = fmt.Sprintf("Updates from %s", artisanName)
	}

	payload := NotificationPayload{
		Title: title,
		Body:  body,
		Data: map[string]string{
			"type":         "artisan",
			"artisan_name": artisanName,
			"action":       action,
		},
	}

	return n.SendToToken(userToken, payload)
}

// SendWelcomeNotification sends a welcome notification to new users
func (n *NotificationService) SendWelcomeNotification(userToken, userName string) error {
	payload := NotificationPayload{
		Title: "Welcome to VoiceCraft Market!",
		Body:  fmt.Sprintf("Hi %s! Discover amazing handcrafted products from talented artisans.", userName),
		Data: map[string]string{
			"type":   "welcome",
			"action": "explore_marketplace",
		},
	}

	return n.SendToToken(userToken, payload)
}

// SendReminderNotification sends reminder notifications
func (n *NotificationService) SendReminderNotification(userToken, reminderType string, data map[string]string) error {
	var title, body string

	switch reminderType {
	case "cart_abandonment":
		title = "Don't Forget Your Cart"
		body = "You have items waiting in your cart. Complete your purchase before they're gone!"
	case "wishlist_sale":
		title = "Items on Sale"
		body = "Some items in your wishlist are on sale. Check them out now!"
	case "review_reminder":
		title = "Share Your Experience"
		body = "How was your recent purchase? Leave a review to help other shoppers."
	default:
		title = "Reminder"
		body = "We have something for you!"
	}

	payload := NotificationPayload{
		Title: title,
		Body:  body,
		Data:  data,
	}

	return n.SendToToken(userToken, payload)
}

// ValidateToken validates if a Firebase token is valid
func (n *NotificationService) ValidateToken(token string) (*auth.Token, error) {
	authToken, err := n.authClient.VerifyIDToken(n.ctx, token)
	if err != nil {
		return nil, fmt.Errorf("failed to verify token: %v", err)
	}

	return authToken, nil
}

// GetUserByUID retrieves user information by UID
func (n *NotificationService) GetUserByUID(uid string) (*auth.UserRecord, error) {
	user, err := n.authClient.GetUser(n.ctx, uid)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return user, nil
}

// CreateCustomToken creates a custom token for a user
func (n *NotificationService) CreateCustomToken(uid string, claims map[string]interface{}) (string, error) {
	token, err := n.authClient.CustomToken(n.ctx, uid)
	if err != nil {
		return "", fmt.Errorf("failed to create custom token: %v", err)
	}

	return token, nil
}

// SetCustomClaims sets custom claims for a user
func (n *NotificationService) SetCustomClaims(uid string, claims map[string]interface{}) error {
	err := n.authClient.SetCustomUserClaims(n.ctx, uid, claims)
	if err != nil {
		return fmt.Errorf("failed to set custom claims: %v", err)
	}

	return nil
}

// LogNotificationEvent logs notification events for analytics
func (n *NotificationService) LogNotificationEvent(eventType, userID string, metadata map[string]interface{}) {
	logData := map[string]interface{}{
		"event_type": eventType,
		"user_id":    userID,
		"timestamp":  fmt.Sprintf("%d", time.Now().Unix()),
		"metadata":   metadata,
	}

	logJSON, _ := json.Marshal(logData)
	log.Printf("Notification Event: %s", string(logJSON))
}
