# VoiceCraft Market API

A Go-based backend API for the VoiceCraft Market platform that enables artisans to create product listings using voice commands.

## Features

- **Voice-to-Product**: Convert voice notes to structured product listings using AI
- **Speech-to-Text**: Google Cloud Speech-to-Text integration
- **AI-Powered**: Vertex AI for product description generation and categorization
- **Firebase Auth**: User authentication and authorization
- **Firestore**: NoSQL database for data persistence
- **Cloud Storage**: File uploads for images and audio
- **Push Notifications**: Firebase Cloud Messaging integration
- **RESTful API**: Clean REST endpoints with proper authentication

## Tech Stack

- **Runtime**: Go 1.23
- **Web Framework**: Gin
- **Database**: Google Cloud Firestore
- **Authentication**: Firebase Auth
- **AI Services**: Google Cloud Vertex AI
- **Speech Recognition**: Google Cloud Speech-to-Text
- **Storage**: Google Cloud Storage
- **Notifications**: Firebase Cloud Messaging

## Project Structure

```
api/
├── main.go                     # Application entry point
├── go.mod                      # Go module dependencies
├── go.sum                      # Dependency checksums
├── .env.example               # Environment variables template
├── internal/
│   ├── config/
│   │   └── config.go          # Configuration management
│   ├── database/
│   │   └── firestore.go       # Firestore client and operations
│   ├── handlers/
│   │   ├── auth.go            # Authentication endpoints
│   │   ├── artisan.go         # Artisan management endpoints
│   │   ├── orders.go          # Order management endpoints
│   │   ├── products.go        # Product CRUD endpoints
│   │   └── voice.go           # Voice processing endpoints
│   ├── middleware/
│   │   ├── auth.go            # Authentication middleware
│   │   └── common.go          # Common middleware (CORS, logging, etc.)
│   ├── models/
│   │   └── models.go          # Data models and structs
│   └── services/
│       ├── ai.go              # Vertex AI service
│       ├── notification.go    # Push notification service
│       ├── speech.go          # Speech-to-text service
│       └── storage.go         # Cloud storage service
```

## Setup Instructions

### Prerequisites

1. **Go 1.23+** installed
2. **Google Cloud Project** with the following APIs enabled:
   - Firestore API
   - Cloud Speech-to-Text API
   - Vertex AI API
   - Cloud Storage API
3. **Firebase Project** with Authentication enabled
4. **Service Account Key** with appropriate permissions

### Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your configuration values in `.env`:
   ```env
   # Server Configuration
   PORT=8080
   ENVIRONMENT=development

   # Google Cloud Configuration
   PROJECT_ID=your-project-id
   LOCATION=us-central1
   FIREBASE_CREDENTIALS_FILE=path/to/serviceAccountKey.json

   # Storage Configuration
   STORAGE_BUCKET=your-storage-bucket
   AUDIO_BUCKET=your-audio-bucket
   IMAGE_BUCKET=your-image-bucket
   ```

3. Download your Firebase service account key and place it in the specified path.

### Installation and Running

1. Install dependencies:
   ```bash
   go mod tidy
   ```

2. Build the application:
   ```bash
   go build -o bin/server .
   ```

3. Run the server:
   ```bash
   ./bin/server
   ```

   Or run directly:
   ```bash
   go run main.go
   ```

The server will start on the port specified in your `.env` file (default: 8080).

## API Endpoints

### Public Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/products` - List products with pagination and filters
- `GET /api/v1/products/:id` - Get product details
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/artisans` - List artisans
- `GET /api/v1/artisans/:id` - Get artisan details
- `POST /api/v1/voice/transcribe` - Transcribe audio to text
- `POST /api/v1/voice/generate` - Generate product from voice/text

### Authenticated Endpoints

**User Profile:**
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update user profile

**Orders:**
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id/cancel` - Cancel order

### Artisan Endpoints (Requires artisan role)

**Profile Management:**
- `GET /api/v1/artisan/profile` - Get artisan profile
- `PUT /api/v1/artisan/profile` - Update artisan profile
- `POST /api/v1/artisan/profile/avatar` - Upload artisan avatar

**Product Management:**
- `GET /api/v1/artisan/products` - Get artisan's products
- `POST /api/v1/artisan/products` - Create new product
- `PUT /api/v1/artisan/products/:id` - Update product
- `DELETE /api/v1/artisan/products/:id` - Delete product
- `POST /api/v1/artisan/products/:id/images` - Upload product images

**Order Management:**
- `GET /api/v1/artisan/orders` - Get orders containing artisan's products
- `PUT /api/v1/artisan/orders/:id/status` - Update order status

### Admin Endpoints (Requires admin role)

**User Management:**
- `GET /api/v1/admin/users` - List all users
- `PUT /api/v1/admin/users/:id/role` - Update user role
- `DELETE /api/v1/admin/users/:id` - Delete user

**System:**
- `GET /api/v1/admin/stats` - Admin dashboard statistics

## Authentication

The API uses Firebase Authentication with JWT tokens. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### User Roles

- **user**: Can browse products, place orders, manage profile
- **artisan**: All user permissions + can create/manage products and view orders
- **admin**: All permissions + user management and system administration

## Voice-to-Product Workflow

1. **Upload Audio**: Send audio file to `/api/v1/voice/transcribe`
2. **Get Transcription**: Receive text transcription of the audio
3. **Generate Product**: Send transcription to `/api/v1/voice/generate`
4. **AI Processing**: Vertex AI generates structured product information
5. **Create Product**: Use generated data to create product via `/api/v1/artisan/products`

## Data Models

### Product
```go
type Product struct {
    ID             string    `json:"id" firestore:"id"`
    Name           string    `json:"name" firestore:"name"`
    Description    string    `json:"description" firestore:"description"`
    Price          float64   `json:"price" firestore:"price"`
    Category       string    `json:"category" firestore:"category"`
    ArtisanID      string    `json:"artisan_id" firestore:"artisan_id"`
    Images         []string  `json:"images" firestore:"images"`
    Stock          int       `json:"stock" firestore:"stock"`
    CreatedAt      time.Time `json:"created_at" firestore:"created_at"`
    UpdatedAt      time.Time `json:"updated_at" firestore:"updated_at"`
}
```

### Order
```go
type Order struct {
    ID          string      `json:"id" firestore:"id"`
    UserID      string      `json:"user_id" firestore:"user_id"`
    Items       []OrderItem `json:"items" firestore:"items"`
    TotalAmount float64     `json:"total_amount" firestore:"total_amount"`
    Status      string      `json:"status" firestore:"status"`
    CreatedAt   time.Time   `json:"created_at" firestore:"created_at"`
    UpdatedAt   time.Time   `json:"updated_at" firestore:"updated_at"`
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Development

### Running in Development Mode

```bash
export ENVIRONMENT=development
go run main.go
```

### Building for Production

```bash
export ENVIRONMENT=production
go build -ldflags="-s -w" -o bin/server .
```

### Testing

```bash
go test ./...
```

## Deployment

### Docker

```dockerfile
FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
CMD ["./server"]
```

### Google Cloud Run

```bash
gcloud run deploy voicecraft-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Monitoring and Logging

- Health check endpoint: `/api/v1/health`
- Structured JSON logging
- Request/response logging middleware
- Error tracking and reporting

## Security Features

- Firebase Authentication integration
- Role-based access control (RBAC)
- CORS protection
- Rate limiting
- Request size limiting
- Security headers
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
