# Firebase Setup Guide

## Complete Authentication Integration

Your VoiceCraft Market project now has **full Firebase authentication** integrated! 🎉

---

## ✅ What's Already Done

### Backend

- ✅ Go backend running on port 8080
- ✅ Firebase Admin SDK configured
- ✅ All API endpoints ready (products, artisans, voice, orders)
- ✅ Authentication middleware in place

### Frontend

- ✅ React app running on port 5173
- ✅ Firebase SDK installed
- ✅ Authentication context with Firebase
- ✅ Login/Signup pages with Firebase integration
- ✅ Protected routes requiring authentication
- ✅ API client with token injection
- ✅ Vite proxy configured (/api → localhost:8080)

---

## 🔧 What You Need to Configure

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "voicecraft-market")
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable these sign-in methods:
   - **Email/Password** (enable it)
   - **Google** (enable it and configure)

### Step 3: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>`
4. Register app (name it anything, e.g., "VoiceCraft Web")
5. Copy the configuration object

### Step 4: Update .env File

Open `.env` in your project root and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_API_URL=http://localhost:8080
```

### Step 5: Get Service Account Key (for Backend)

1. In Firebase Console, go to **Project Settings**
2. Go to **Service Accounts** tab
3. Click "Generate new private key"
4. Download the JSON file
5. Save it as `service-account.json` in `backend/api/internal/config/`

### Step 6: Update Backend .env

Make sure your backend `.env` has:

```env
GOOGLE_APPLICATION_CREDENTIALS=internal/config/service-account.json
GOOGLE_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=your-bucket-name
VERTEX_AI_LOCATION=us-central1
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

---

## 🚀 How to Run

### Terminal 1 - Backend

```powershell
cd backend/api
go run main.go
```

Backend will run on: http://localhost:8080

### Terminal 2 - Frontend

```powershell
npm run dev
```

Frontend will run on: http://localhost:5173

---

## 🎯 Features Available

### Authentication

✅ **Email/Password Login**

- Users can sign up with email and password
- Login with existing credentials
- Password visibility toggle

✅ **Google Sign-In**

- One-click authentication
- Auto-creates user profile

✅ **Protected Routes**

- Dashboard requires authentication
- Upload page requires artisan role
- Auto-redirects to login if not authenticated

✅ **User Profile**

- Stores user details in Firestore
- Artisan profile with craft, location, bio
- Role-based access (artisan/customer)

### Pages with Auth

1. **Login/Signup** (`/login`)

   - Multi-language support (English/Hindi/Hinglish)
   - Email/password forms
   - Google authentication
   - Error handling with toasts
   - Auto-navigation after login

2. **Dashboard** (`/dashboard`)

   - Protected route (requires auth)
   - Shows user's name
   - Logout button with Firebase signout
   - Analytics and products

3. **Upload** (`/upload`)

   - Protected route (requires artisan role)
   - Voice upload to Cloud Storage
   - AI product generation with Vertex AI
   - Creates products in Firestore

4. **Marketplace** (`/marketplace`)
   - Public access (no auth required)
   - Real-time product fetching from Firestore
   - Search and filters
   - Pagination

---

## 🔐 Authentication Flow

```
User visits protected page
     ↓
Check if authenticated
     ↓
   NO → Redirect to /login
     ↓
Login with email/Google
     ↓
Firebase creates auth token
     ↓
Token stored in AuthContext
     ↓
Token added to API requests
     ↓
Backend verifies token
     ↓
User data synced with Firestore
     ↓
Redirect to dashboard
```

---

## 📝 Code Structure

### Frontend Auth Files

- `src/lib/firebase.ts` - Firebase initialization
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/pages/Login.tsx` - Login/signup UI
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/services/api/client.ts` - API client with auth

### Backend Auth Files

- `backend/api/internal/config/config.go` - Firebase Admin config
- `backend/api/internal/middleware/auth.go` - Token verification
- `backend/api/internal/handlers/auth.go` - Auth endpoints

---

## 🐛 Troubleshooting

### "Firebase not configured"

- Check `.env` file has all VITE*FIREBASE*\* variables
- Restart dev server after updating `.env`

### "Authentication failed"

- Verify Email/Password is enabled in Firebase Console
- Check if Google sign-in is configured

### "API request failed"

- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify Vite proxy is configured

### "Protected route not working"

- Check if AuthProvider wraps App in main.tsx
- Verify ProtectedRoute component is used correctly
- Check browser console for auth state

---

## 🎨 Next Steps

Once Firebase is configured:

1. **Test Authentication**

   - Sign up with email
   - Login with email
   - Login with Google
   - Logout

2. **Test Protected Routes**

   - Try accessing /dashboard without login
   - Login and access /dashboard
   - Try /upload page

3. **Test API Integration**

   - Create a product via /upload
   - View products in /marketplace
   - Check Firestore for data

4. **Customize**
   - Update logo and branding
   - Modify color scheme
   - Add more artisan profile fields
   - Implement order management

---

## 📚 Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cloud Storage for Firebase](https://firebase.google.com/docs/storage)

---

## 🙌 You're All Set!

Your full-stack artisan marketplace is ready. Just add your Firebase credentials and you're good to go! 🚀
