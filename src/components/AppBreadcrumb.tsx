import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

interface AppBreadcrumbProps {
  language?: 'english' | 'hindi' | 'hinglish';
  customItems?: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({ 
  language = 'english',
  customItems 
}) => {
  const location = useLocation();

  const translations = {
    english: {
      home: 'Home',
      marketplace: 'Marketplace',
      dashboard: 'Dashboard',
      upload: 'Upload Product',
      cart: 'Cart',
      login: 'Login',
      product: 'Product',
      artisan: 'Artisan',
      category: 'Category',
      search: 'Search Results'
    },
    hindi: {
      home: 'होम',
      marketplace: 'बाज़ार',
      dashboard: 'डैशबोर्ड',
      upload: 'उत्पाद अपलोड',
      cart: 'कार्ट',
      login: 'लॉगिन',
      product: 'उत्पाद',
      artisan: 'कारीगर',
      category: 'श्रेणी',
      search: 'खोज परिणाम'
    },
    hinglish: {
      home: 'Home',
      marketplace: 'Marketplace',
      dashboard: 'Dashboard',
      upload: 'Product Upload',
      cart: 'Cart',
      login: 'Login',
      product: 'Product',
      artisan: 'Artisan',
      category: 'Category',
      search: 'Search Results'
    }
  };

  const t = translations[language];

  // If custom items are provided, use them
  if (customItems) {
    return (
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4" />
                <span className="sr-only">{t.home}</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {customItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.current || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Auto-generate breadcrumbs based on current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Skip breadcrumbs for certain pages
  if (pathSegments.length === 0 || ['login'].includes(pathSegments[0])) {
    return null;
  }

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;

    // Get translated label
    let label = segment;
    if (t[segment as keyof typeof t]) {
      label = t[segment as keyof typeof t];
    } else {
      // Capitalize first letter for segments not in translations
      label = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    return {
      label,
      href: path,
      current: isLast
    };
  });

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">{t.home}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.current ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
