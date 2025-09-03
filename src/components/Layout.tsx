import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [language, setLanguage] = React.useState<'english' | 'hindi' | 'hinglish'>('english');

  // Mock authentication state - replace with actual auth context
  const [authState] = React.useState({
    isAuthenticated: false,
    isArtisan: false,
    cartCount: 3
  });

  // Routes that should hide navigation/footer (like full-screen auth pages)
  const hideLayoutRoutes = ['/login'];
  const shouldHideLayout = hideLayoutRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Routes that should have minimal layout (like dashboard)
  const minimalLayoutRoutes = ['/dashboard', '/upload'];
  const shouldUseMinimalLayout = minimalLayoutRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (shouldHideLayout) {
    return (
      <>
        {children || <Outlet />}
        <Toaster />
        <Sonner />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {!shouldUseMinimalLayout && <Footer language={language} />}
      
      <Toaster />
      <Sonner />
    </div>
  );
};
