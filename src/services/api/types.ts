// API Type Definitions matching backend models

export interface Product {
  id: string;
  artisan_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  video_url?: string;
  status: 'draft' | 'active' | 'out_of_stock' | 'archived';
  stock: number;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  materials?: string[];
  crafting_time?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  seo_keywords?: string[];
  voice_story?: VoiceStory;
  ai_generated_content?: AIGeneratedContent;
  view_count: number;
  like_count: number;
  share_count: number;
  sales_count: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface VoiceStory {
  audio_url: string;
  duration: number;
  transcript: string;
  language: string;
  quality: string;
  processed_at: string;
  translations?: Record<string, string>;
}

export interface AIGeneratedContent {
  product_title: string;
  description: string;
  artisan_story: Record<string, string>;
  suggested_price: number;
  seo_keywords: string[];
  hashtags: string[];
  social_media: SocialMediaContent;
  whatsapp_catalog: WhatsAppCatalogEntry;
  faq?: FAQItem[];
  generated_at: string;
  model_version: string;
  confidence: number;
}

export interface SocialMediaContent {
  instagram_reels: InstagramReel[];
  instagram_posts: InstagramPost[];
  facebook_posts: FacebookPost[];
  twitter_posts: TwitterPost[];
}

export interface InstagramReel {
  script: string;
  captions: string[];
  hashtags: string[];
  duration: number;
  music_suggestion?: string;
}

export interface InstagramPost {
  caption: string;
  hashtags: string[];
  image_prompt?: string;
}

export interface FacebookPost {
  content: string;
  hashtags: string[];
}

export interface TwitterPost {
  content: string;
  hashtags: string[];
}

export interface WhatsAppCatalogEntry {
  title: string;
  description: string;
  price: string;
  currency: string;
  image_url: string;
  product_url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArtisanProfile {
  id: string;
  craft: string;
  location: string;
  years_experience: number;
  specialties: string[];
  bio: string;
  story: string;
  cover_image_url?: string;
  social_links?: Record<string, string>;
  achievements?: string[];
  is_verified: boolean;
  rating: number;
  review_count: number;
  follower_count: number;
  total_sales: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  avatar: string | null;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UserStats {
  ordersPlaced: number;
  totalSpent: number;
  productsListed: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  emailVerified: boolean;
  photoURL: string | null;
  role: 'customer' | 'artisan' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  preferences: UserPreferences;
  profile: UserProfile;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  artisan_profile?: ArtisanProfile;
}

export interface Order {
  id: string;
  buyer_id: string;
  artisan_id: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';
  payment_status: string;
  payment_id?: string;
  shipping_address: Address;
  billing_address: Address;
  created_at: string;
  updated_at: string;
  delivered_at?: string;
  tracking_info?: TrackingInfo;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface TrackingInfo {
  carrier: string;
  tracking_number: string;
  estimated_delivery?: string;
}

export interface VoiceTranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
  duration: number;
  alternatives?: string[];
  words?: WordInfo[];
}

export interface WordInfo {
  word: string;
  start_time: number;
  end_time: number;
  confidence: number;
}

export interface ProductGenerationResponse {
  original_text: string;
  product: AIGeneratedContent;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
