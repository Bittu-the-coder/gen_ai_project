import { ProtectedRoute } from '@/components/ProtectedRoute';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Page components
import APITester from '@/components/APITester';
import ArtisanProfile from '@/pages/ArtisanProfile';
import Cart from '@/pages/Cart';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Marketplace from '@/pages/MarketplaceNew';
import NotFound from '@/pages/NotFound';
import ProductDetail from '@/pages/ProductDetail';
import Upload from '@/pages/Upload';

interface AppRoutesProps {
  language?: 'english' | 'hindi' | 'hinglish';
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  language = 'english',
}) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/artisan/:id" element={<ArtisanProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/api-test" element={<APITester />} />

      {/* Protected Routes - Require Authentication */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute requireAuth={true} language={language}>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Require Artisan Access */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            requireAuth={true}
            requireArtisan={true}
            language={language}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute
            requireAuth={true}
            requireArtisan={true}
            language={language}
          >
            <Upload />
          </ProtectedRoute>
        }
      />

      {/* Nested Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute
            requireAuth={true}
            requireArtisan={true}
            language={language}
          >
            <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="products" element={<Dashboard />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="profile" element={<Dashboard />} />
              <Route path="orders" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Nested Marketplace Routes */}
      <Route
        path="/marketplace/*"
        element={
          <Routes>
            <Route index element={<Marketplace />} />
            <Route path="category/:category" element={<Marketplace />} />
            <Route path="search" element={<Marketplace />} />
            <Route path="artisan/:artisanId" element={<ArtisanProfile />} />
          </Routes>
        }
      />

      {/* Redirects for common paths */}
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/shop" element={<Navigate to="/marketplace" replace />} />
      <Route path="/sell" element={<Navigate to="/upload" replace />} />
      <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Route configuration for easier management
export const routeConfig = {
  public: [
    { path: '/', name: 'Home', component: 'Index' },
    { path: '/marketplace', name: 'Marketplace', component: 'Marketplace' },
    {
      path: '/product/:id',
      name: 'Product Detail',
      component: 'ProductDetail',
    },
    {
      path: '/artisan/:id',
      name: 'Artisan Profile',
      component: 'ArtisanProfile',
    },
    { path: '/login', name: 'Login', component: 'Login' },
  ],
  protected: [
    { path: '/cart', name: 'Cart', component: 'Cart', requireAuth: true },
  ],
  artisan: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: 'Dashboard',
      requireAuth: true,
      requireArtisan: true,
    },
    {
      path: '/upload',
      name: 'Upload Product',
      component: 'Upload',
      requireAuth: true,
      requireArtisan: true,
    },
  ],
};

// Route metadata for SEO and navigation
export const routeMetadata = {
  '/': {
    title: 'VoiceCraft Market - AI-Powered Marketplace for Local Artisans',
    description:
      'Empowering artisans to sell globally with just a voice note. AI creates your product story, descriptions, and social media content in 60 seconds.',
    keywords:
      'artisan marketplace, voice to shop, AI powered, local artisans, handcrafted products',
  },
  '/marketplace': {
    title: 'Marketplace - Discover Authentic Handcrafted Products',
    description:
      'Browse authentic handcrafted products with their voice stories from local artisans around the world.',
    keywords:
      'handcrafted products, artisan marketplace, authentic crafts, voice stories',
  },
  '/dashboard': {
    title: 'Artisan Dashboard - Manage Your Products',
    description: 'Manage your artisan profile, products, and sales analytics.',
    keywords: 'artisan dashboard, product management, sales analytics',
  },
  '/upload': {
    title: 'Upload Product - Create with Voice',
    description:
      'Upload a voice note and let AI create your product story in 60 seconds.',
    keywords: 'voice upload, AI product creation, artisan tools',
  },
};

export default AppRoutes;
