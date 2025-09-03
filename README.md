# Project: Voice-to-Shop – AI-Powered Web Marketplace for Local Artisans

## Goal

Build a **website** that empowers artisans to sell online with just a **voice note**. Within 60 seconds, AI generates:

* Product page (title, description, price suggestion).
* Artisan story in multiple languages (English, Hindi, Hinglish).
* Social media content (3 Instagram reel scripts, SEO hashtags, captions).
* WhatsApp Catalog entry for direct selling.

## Tech Stack

* **Frontend (Web):** React (Vite/Next.js optional)
* **Backend:** Node.js (Express) → deploy on Google Cloud Run
* **Database:** Firestore (artisan profiles, products)
* **Authentication:** Firebase Auth
* **Storage:** Google Cloud Storage (product images/audio)
* **AI Services:**

  * Google Speech-to-Text → transcribe artisan’s voice note
  * Vertex AI (Gemini) → generate descriptions, stories, captions
* **Deployment:** Firebase Hosting (web), Cloud Run (API)

## Core Features

1. **Voice-to-Shop Pipeline**

   * Upload audio → Speech-to-Text → Vertex AI → JSON output
   * JSON contains: title, description, story, hashtags, reel scripts, FAQ
   * Save result in Firestore + Storage

2. **Artisan Website (React)**

   * Record/upload voice note (mic input or file upload)
   * Display generated product card with AI content
   * One-click publish to:

     * WhatsApp Catalog (API)
     * Marketplace storefront

3. **Marketplace Website (React)**

   * Browse artisan shops & products
   * Product detail page with artisan story + AI-generated content
   * Multilingual toggle (English/Hindi/Hinglish)

4. **Admin/Buyer Features**

   * Artisan signup/login (Firebase Auth)
   * Buyer view + cart (basic checkout placeholder)
   * Artisan dashboard for product management

## Architecture

/web        -> React web marketplace
/api        -> Node/Express backend API (Cloud Run)
/routes     -> /upload, /generate, /publish
/db         -> Firestore schema definitions
/ai         -> prompt templates, Google AI API calls
/storage    -> config for GCS bucket

## Tasks for Copilot

* Scaffold `api/index.js` with Express server & routes.
* Create `api/routes/generate.js`:

  * Accept audio upload
  * Call Google Speech-to-Text
  * Call Vertex AI (Gemini) with artisan prompt
  * Return structured JSON
* Scaffold React web:

  * Page: Audio upload → display generated product card
  * Page: Artisan profile + product listing
  * Page: Product detail with story/hashtags/FAQs
* Add Firestore schema for artisans, products, content
* Add Firebase Auth for artisan login/signup
* Configure Google Cloud Storage for audio + image uploads

## Example Copilot Prompts

* “Generate an Express route `/generate` that accepts audio upload, transcribes it with Google Speech-to-Text, then calls Vertex AI to generate product details.”
* “In React, build a file upload + microphone recorder component that sends audio to the backend and displays the returned JSON as a product card.”
* “Create a React product detail page that loads data from Firestore and displays title, description, story, hashtags, and FAQs.”

