package services

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"cloud.google.com/go/vertexai/genai"
)

type VertexAIService struct {
	client   *genai.Client
	ctx      context.Context
	location string
	model    string
}

type ProductGenerationRequest struct {
	Transcript   string `json:"transcript"`
	Language     string `json:"language"`
	ArtisanName  string `json:"artisan_name,omitempty"`
	ArtisanCraft string `json:"artisan_craft,omitempty"`
	Category     string `json:"category,omitempty"`
}

type ProductGenerationResponse struct {
	ProductTitle    string                    `json:"product_title"`
	Description     string                    `json:"description"`
	SuggestedPrice  float64                   `json:"suggested_price"`
	Currency        string                    `json:"currency"`
	ArtisanStory    map[string]string         `json:"artisan_story"`
	SEOKeywords     []string                  `json:"seo_keywords"`
	Hashtags        []string                  `json:"hashtags"`
	SocialMedia     SocialMediaGeneration     `json:"social_media"`
	WhatsAppCatalog WhatsAppCatalogGeneration `json:"whatsapp_catalog"`
	FAQ             []FAQGeneration           `json:"faq"`
	Materials       []string                  `json:"materials"`
	CraftingTime    string                    `json:"crafting_time"`
	Tags            []string                  `json:"tags"`
	Confidence      float64                   `json:"confidence"`
}

type SocialMediaGeneration struct {
	InstagramReels []InstagramReelGeneration `json:"instagram_reels"`
	InstagramPosts []InstagramPostGeneration `json:"instagram_posts"`
	FacebookPosts  []FacebookPostGeneration  `json:"facebook_posts"`
	TwitterPosts   []TwitterPostGeneration   `json:"twitter_posts"`
}

type InstagramReelGeneration struct {
	Script          string   `json:"script"`
	Captions        []string `json:"captions"`
	Hashtags        []string `json:"hashtags"`
	Duration        int      `json:"duration"`
	MusicSuggestion string   `json:"music_suggestion"`
}

type InstagramPostGeneration struct {
	Caption     string   `json:"caption"`
	Hashtags    []string `json:"hashtags"`
	ImagePrompt string   `json:"image_prompt"`
}

type FacebookPostGeneration struct {
	Content  string   `json:"content"`
	Hashtags []string `json:"hashtags"`
}

type TwitterPostGeneration struct {
	Content  string   `json:"content"`
	Hashtags []string `json:"hashtags"`
}

type WhatsAppCatalogGeneration struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Price       string `json:"price"`
	Currency    string `json:"currency"`
}

type FAQGeneration struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

func NewVertexAIService(ctx context.Context, projectID, location, model string) (*VertexAIService, error) {
	client, err := genai.NewClient(ctx, projectID, location)
	if err != nil {
		return nil, fmt.Errorf("failed to create Vertex AI client: %v", err)
	}

	return &VertexAIService{
		client:   client,
		ctx:      ctx,
		location: location,
		model:    model,
	}, nil
}

func (v *VertexAIService) Close() error {
	return v.client.Close()
}

func (v *VertexAIService) GenerateProductContent(req *ProductGenerationRequest) (*ProductGenerationResponse, error) {
	prompt := v.buildPrompt(req)

	model := v.client.GenerativeModel(v.model)
	model.SetTemperature(0.7)
	model.SetTopK(40)
	model.SetTopP(0.8)
	model.SetMaxOutputTokens(4000)

	resp, err := model.GenerateContent(v.ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("no content generated")
	}

	responseText := resp.Candidates[0].Content.Parts[0].(genai.Text)

	// Parse the JSON response
	var result ProductGenerationResponse
	if err := json.Unmarshal([]byte(responseText), &result); err != nil {
		return nil, fmt.Errorf("failed to parse generated content: %v", err)
	}

	// Set confidence based on response quality
	result.Confidence = v.calculateConfidence(&result)

	return &result, nil
}

func (v *VertexAIService) buildPrompt(req *ProductGenerationRequest) string {
	languages := map[string]string{
		"english":  "English",
		"hindi":    "Hindi",
		"hinglish": "Hinglish (mix of Hindi and English)",
	}

	languageName := languages[req.Language]
	if languageName == "" {
		languageName = "English"
	}

	prompt := fmt.Sprintf(`You are an AI assistant helping Indian artisans create compelling product listings and social media content. 

Based on the following voice transcript from an artisan describing their handcrafted product, generate comprehensive content in JSON format:

**Voice Transcript:** "%s"
**Language:** %s
**Artisan Name:** %s
**Artisan Craft:** %s
**Category:** %s

Generate a JSON response with the following structure:

{
  "product_title": "Catchy, SEO-friendly product title",
  "description": "Detailed product description (200-300 words) highlighting craftsmanship, materials, and cultural significance",
  "suggested_price": 1500.0,
  "currency": "INR",
  "artisan_story": {
    "english": "Artisan's story in English (100-150 words)",
    "hindi": "Artisan's story in Hindi (100-150 words)",
    "hinglish": "Artisan's story in Hinglish (100-150 words)"
  },
  "seo_keywords": ["relevant", "SEO", "keywords"],
  "hashtags": ["#handmade", "#indian", "#artisan", "#traditional"],
  "social_media": {
    "instagram_reels": [
      {
        "script": "30-second reel script showing the crafting process",
        "captions": ["Caption option 1", "Caption option 2"],
        "hashtags": ["#reelspecific", "#hashtags"],
        "duration": 30,
        "music_suggestion": "Traditional Indian music or trending audio"
      }
    ],
    "instagram_posts": [
      {
        "caption": "Engaging Instagram post caption",
        "hashtags": ["#post", "#hashtags"],
        "image_prompt": "Description for AI image generation"
      }
    ],
    "facebook_posts": [
      {
        "content": "Facebook post content",
        "hashtags": ["#facebook", "#hashtags"]
      }
    ],
    "twitter_posts": [
      {
        "content": "Concise Twitter post under 280 characters",
        "hashtags": ["#twitter", "#hashtags"]
      }
    ]
  },
  "whatsapp_catalog": {
    "title": "WhatsApp catalog title",
    "description": "Brief catalog description",
    "price": "₹1,500",
    "currency": "INR"
  },
  "faq": [
    {
      "question": "Common customer question",
      "answer": "Detailed answer"
    }
  ],
  "materials": ["clay", "natural pigments", "traditional tools"],
  "crafting_time": "2-3 days",
  "tags": ["handcrafted", "eco-friendly", "traditional"]
}

**Important Guidelines:**
1. Maintain cultural authenticity and respect for traditional crafts
2. Price suggestions should be reasonable for Indian market (₹100-₹50,000 range)
3. Include emotional storytelling that connects with customers
4. Use trending and relevant hashtags for better reach
5. Ensure all content is family-friendly and professional
6. Include multilingual content to reach diverse audiences
7. Focus on the uniqueness and handcrafted nature of the product
8. Consider seasonal relevance and gifting potential

Generate only valid JSON without any additional text or explanations.`,
		req.Transcript, languageName, req.ArtisanName, req.ArtisanCraft, req.Category)

	return prompt
}

func (v *VertexAIService) calculateConfidence(resp *ProductGenerationResponse) float64 {
	score := 0.0

	// Check if essential fields are present and meaningful
	if len(resp.ProductTitle) > 10 {
		score += 0.2
	}
	if len(resp.Description) > 100 {
		score += 0.2
	}
	if resp.SuggestedPrice > 0 {
		score += 0.1
	}
	if len(resp.SEOKeywords) >= 3 {
		score += 0.1
	}
	if len(resp.Hashtags) >= 5 {
		score += 0.1
	}
	if len(resp.SocialMedia.InstagramReels) > 0 {
		score += 0.1
	}
	if len(resp.ArtisanStory) >= 2 {
		score += 0.1
	}
	if len(resp.FAQ) >= 2 {
		score += 0.1
	}

	// Bonus for completeness
	if score >= 0.8 {
		score = 0.95
	}

	return score
}

// TranslateContent translates content to different languages
func (v *VertexAIService) TranslateContent(content, fromLang, toLang string) (string, error) {
	prompt := fmt.Sprintf(`Translate the following text from %s to %s while maintaining the tone and cultural context:

"%s"

Provide only the translation without any additional text or explanations.`, fromLang, toLang, content)

	model := v.client.GenerativeModel(v.model)
	model.SetTemperature(0.3)
	model.SetMaxOutputTokens(1000)

	resp, err := model.GenerateContent(v.ctx, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to translate content: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no translation generated")
	}

	translation := string(resp.Candidates[0].Content.Parts[0].(genai.Text))
	return strings.TrimSpace(translation), nil
}

// GenerateImagePrompt generates AI image prompts for products
func (v *VertexAIService) GenerateImagePrompt(productTitle, description string) (string, error) {
	prompt := fmt.Sprintf(`Based on this handcrafted product, generate a detailed image prompt for AI image generation:

Product Title: %s
Description: %s

Create a prompt that would generate a high-quality, professional product photo suitable for e-commerce. Include details about lighting, background, angles, and styling.

Provide only the image prompt without any additional text.`, productTitle, description)

	model := v.client.GenerativeModel(v.model)
	model.SetTemperature(0.7)
	model.SetMaxOutputTokens(500)

	resp, err := model.GenerateContent(v.ctx, genai.Text(prompt))
	if err != nil {
		return "", fmt.Errorf("failed to generate image prompt: %v", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no image prompt generated")
	}

	imagePrompt := string(resp.Candidates[0].Content.Parts[0].(genai.Text))
	return strings.TrimSpace(imagePrompt), nil
}
