import { NavigateFunction } from 'react-router-dom';

// Route constants for type safety
export const ROUTES = {
  HOME: '/',
  MARKETPLACE: '/marketplace',
  PRODUCT_DETAIL: '/product/:id',
  ARTISAN_PROFILE: '/artisan/:id',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  LOGIN: '/login',
  CART: '/cart',
  NOT_FOUND: '/404',
  
  // Nested routes
  MARKETPLACE_CATEGORY: '/marketplace/category/:category',
  MARKETPLACE_SEARCH: '/marketplace/search',
  DASHBOARD_PRODUCTS: '/dashboard/products',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_ORDERS: '/dashboard/orders',
  DASHBOARD_SETTINGS: '/dashboard/settings',
} as const;

export type RouteKeys = keyof typeof ROUTES;

// Helper functions to build routes with parameters
export const buildRoute = {
  productDetail: (id: string) => `/product/${id}`,
  artisanProfile: (id: string) => `/artisan/${id}`,
  marketplaceCategory: (category: string) => `/marketplace/category/${category}`,
  marketplaceSearch: (query?: string) => {
    const searchParams = query ? `?q=${encodeURIComponent(query)}` : '';
    return `/marketplace/search${searchParams}`;
  }
};

// Navigation helper class
export class NavigationHelper {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Basic navigation methods
  goHome = () => this.navigate(ROUTES.HOME);
  goToMarketplace = () => this.navigate(ROUTES.MARKETPLACE);
  goToDashboard = () => this.navigate(ROUTES.DASHBOARD);
  goToUpload = () => this.navigate(ROUTES.UPLOAD);
  goToLogin = (from?: string) => {
    const state = from ? { from } : undefined;
    this.navigate(ROUTES.LOGIN, { state });
  };
  goToCart = () => this.navigate(ROUTES.CART);

  // Parameterized navigation methods
  goToProduct = (id: string) => this.navigate(buildRoute.productDetail(id));
  goToArtisan = (id: string) => this.navigate(buildRoute.artisanProfile(id));
  goToCategory = (category: string) => this.navigate(buildRoute.marketplaceCategory(category));
  goToSearch = (query?: string) => this.navigate(buildRoute.marketplaceSearch(query));

  // Dashboard navigation
  goToDashboardSection = (section: 'products' | 'analytics' | 'profile' | 'orders' | 'settings') => {
    this.navigate(`/dashboard/${section}`);
  };

  // Navigation with replace (for redirects)
  replaceWith = (path: string) => this.navigate(path, { replace: true });
  
  // Go back
  goBack = () => this.navigate(-1);
  
  // Go forward
  goForward = () => this.navigate(1);
}

// URL parameter extractors
export const extractParams = {
  productId: (pathname: string): string | null => {
    const match = pathname.match(/^\/product\/(.+)$/);
    return match ? match[1] : null;
  },
  
  artisanId: (pathname: string): string | null => {
    const match = pathname.match(/^\/artisan\/(.+)$/);
    return match ? match[1] : null;
  },
  
  category: (pathname: string): string | null => {
    const match = pathname.match(/^\/marketplace\/category\/(.+)$/);
    return match ? match[1] : null;
  }
};

// Search parameter helpers
export const searchParams = {
  get: (url: string, param: string): string | null => {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.searchParams.get(param);
  },
  
  set: (url: string, param: string, value: string): string => {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set(param, value);
    return urlObj.pathname + urlObj.search;
  },
  
  delete: (url: string, param: string): string => {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.delete(param);
    return urlObj.pathname + urlObj.search;
  }
};

// Route guards and permissions
export const routePermissions = {
  isPublicRoute: (pathname: string): boolean => {
    const publicRoutes = [
      ROUTES.HOME,
      ROUTES.MARKETPLACE,
      ROUTES.LOGIN,
      '/marketplace/category',
      '/marketplace/search',
      '/product',
      '/artisan'
    ];
    
    return publicRoutes.some(route => {
      if (route.includes(':')) {
        // Handle parameterized routes
        const pattern = route.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(pathname);
      }
      return pathname === route || pathname.startsWith(route + '/');
    });
  },
  
  requiresAuth: (pathname: string): boolean => {
    const authRoutes = [ROUTES.CART, ROUTES.DASHBOARD, ROUTES.UPLOAD];
    return authRoutes.some(route => pathname.startsWith(route));
  },
  
  requiresArtisan: (pathname: string): boolean => {
    const artisanRoutes = [ROUTES.DASHBOARD, ROUTES.UPLOAD];
    return artisanRoutes.some(route => pathname.startsWith(route));
  }
};

// Route metadata for SEO and analytics
export const getRouteMetadata = (pathname: string) => {
  const metadata = {
    '/': {
      title: 'VoiceCraft Market - AI-Powered Marketplace for Local Artisans',
      description: 'Empowering artisans to sell globally with just a voice note.',
      breadcrumbs: []
    },
    '/marketplace': {
      title: 'Marketplace - Discover Authentic Handcrafted Products',
      description: 'Browse authentic handcrafted products with their voice stories.',
      breadcrumbs: [{ label: 'Marketplace', href: '/marketplace' }]
    },
    '/dashboard': {
      title: 'Artisan Dashboard - Manage Your Products',
      description: 'Manage your artisan profile, products, and sales analytics.',
      breadcrumbs: [{ label: 'Dashboard', href: '/dashboard' }]
    },
    '/upload': {
      title: 'Upload Product - Create with Voice',
      description: 'Upload a voice note and let AI create your product story.',
      breadcrumbs: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Upload Product', href: '/upload' }
      ]
    }
  };
  
  // Return default metadata for unknown routes
  return metadata[pathname as keyof typeof metadata] || {
    title: 'VoiceCraft Market',
    description: 'AI-Powered Marketplace for Local Artisans',
    breadcrumbs: []
  };
};

export default {
  ROUTES,
  buildRoute,
  NavigationHelper,
  extractParams,
  searchParams,
  routePermissions,
  getRouteMetadata
};
