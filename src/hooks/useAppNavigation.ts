import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { NavigationHelper, extractParams, routePermissions, getRouteMetadata } from '@/lib/routes';
import { useMemo } from 'react';

// Custom hook for enhanced navigation
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigationHelper = useMemo(() => new NavigationHelper(navigate), [navigate]);

  const routeInfo = useMemo(() => ({
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    key: location.key,
    isPublic: routePermissions.isPublicRoute(location.pathname),
    requiresAuth: routePermissions.requiresAuth(location.pathname),
    requiresArtisan: routePermissions.requiresArtisan(location.pathname),
    metadata: getRouteMetadata(location.pathname)
  }), [location]);

  const extractedParams = useMemo(() => ({
    productId: extractParams.productId(location.pathname),
    artisanId: extractParams.artisanId(location.pathname),
    category: extractParams.category(location.pathname)
  }), [location.pathname]);

  // Search parameter helpers
  const getSearchParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const setSearchParam = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(key, value);
    setSearchParams(newSearchParams);
  };

  const removeSearchParam = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(key);
    setSearchParams(newSearchParams);
  };

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    
    setSearchParams(newSearchParams);
  };

  return {
    // React Router hooks
    navigate,
    location,
    params,
    searchParams,
    
    // Enhanced navigation helper
    navigationHelper,
    
    // Route information
    routeInfo,
    extractedParams,
    
    // Search parameter helpers
    getSearchParam,
    setSearchParam,
    removeSearchParam,
    updateSearchParams,
    
    // Quick navigation methods (delegated to navigationHelper)
    goHome: navigationHelper.goHome,
    goToMarketplace: navigationHelper.goToMarketplace,
    goToDashboard: navigationHelper.goToDashboard,
    goToUpload: navigationHelper.goToUpload,
    goToLogin: navigationHelper.goToLogin,
    goToCart: navigationHelper.goToCart,
    goToProduct: navigationHelper.goToProduct,
    goToArtisan: navigationHelper.goToArtisan,
    goToCategory: navigationHelper.goToCategory,
    goToSearch: navigationHelper.goToSearch,
    goToDashboardSection: navigationHelper.goToDashboardSection,
    goBack: navigationHelper.goBack,
    goForward: navigationHelper.goForward,
    replaceWith: navigationHelper.replaceWith
  };
};

// Hook for specific route parameters
export const useRouteParams = () => {
  const params = useParams();
  const location = useLocation();
  
  return {
    ...params,
    productId: params.id && location.pathname.startsWith('/product/') ? params.id : undefined,
    artisanId: params.id && location.pathname.startsWith('/artisan/') ? params.id : undefined,
    category: params.category,
    dashboardSection: location.pathname.replace('/dashboard/', '') || 'overview'
  };
};

// Hook for search functionality
export const useSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || '';
  const priceMin = searchParams.get('price_min') || '';
  const priceMax = searchParams.get('price_max') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const updateSearch = (updates: {
    q?: string;
    category?: string;
    sort?: string;
    price_min?: string;
    price_max?: string;
    page?: number;
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });
    
    // Reset page when other filters change (except page itself)
    if (Object.keys(updates).some(key => key !== 'page') && !('page' in updates)) {
      newSearchParams.delete('page');
    }
    
    setSearchParams(newSearchParams);
  };
  
  const clearSearch = () => {
    setSearchParams(new URLSearchParams());
  };
  
  return {
    searchQuery,
    category,
    sortBy,
    priceMin,
    priceMax,
    page,
    updateSearch,
    clearSearch,
    hasActiveFilters: searchQuery || category || sortBy || priceMin || priceMax
  };
};

export default useAppNavigation;
