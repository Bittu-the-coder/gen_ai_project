# Firestore Setup Guide

## Issue

Your Firebase project "nexorians" has Firestore API disabled, causing database operations to fail with the error:

```
Cloud Firestore API has not been used in project nexorians before or it is disabled.
```

## Solution Steps

### 1. Enable Firestore via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your "nexorians" project
3. Click on "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose security rules:
   - **Test mode** (for development) - allows read/write access
   - **Production mode** - requires authentication rules
6. Select a location (recommend: `us-central1` or closest to your users)
7. Click "Done"

### 2. Enable Firestore via Google Cloud Console (Alternative)

1. Visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=nexorians
2. Click "Enable API"
3. Wait 2-3 minutes for the API to be fully activated

### 3. Set Up Security Rules (Important)

After enabling Firestore, configure security rules in the Firebase Console:

#### For Development (Test Mode):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### For Production (Secure Mode):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Products are publicly readable, writable by authenticated users
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders are only accessible by the order owner
    match /orders/{orderId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Verify Setup

After enabling Firestore, test the API by visiting:

- Health check: http://localhost:3001/api/v1/health
- Profile endpoint: http://localhost:3001/api/v1/profile (requires authentication)

### 5. Initialize Sample Data (Optional)

Once Firestore is enabled, you can create sample collections and documents:

1. Go to Firestore Console
2. Click "Start collection"
3. Create collections: `users`, `products`, `orders`
4. Add sample documents for testing

## Troubleshooting

### If the error persists after enabling:

1. Wait 5-10 minutes for changes to propagate
2. Restart your backend server: `npm run dev`
3. Check service account permissions in Google Cloud IAM
4. Verify your environment variables are correct

### Check Environment Variables:

Ensure these are set in your `.env` file:

- `FIREBASE_PROJECT_ID=nexorians`
- `FIREBASE_CLIENT_EMAIL=backend-service@nexorians.iam.gserviceaccount.com`
- All other Firebase config variables

### Service Account Permissions:

Your service account needs these roles:

- Firebase Admin SDK Administrator Service Agent
- Cloud Datastore User (or Firestore Service Agent)

## Testing

After setup, test with curl:

```bash
# Health check
curl http://localhost:3001/api/v1/health

# Profile (requires valid JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/v1/profile
```

## Next Steps

1. Enable Firestore following the steps above
2. Restart your backend server
3. Test the endpoints
4. Configure security rules for production use
5. Set up proper indexes if needed for complex queries
