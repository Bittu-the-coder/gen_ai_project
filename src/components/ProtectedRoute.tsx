import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Lock } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireArtisan?: boolean;
  fallbackPath?: string;
  language?: 'english' | 'hindi' | 'hinglish';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireArtisan = false,
  fallbackPath = '/login',
  language = 'english',
}) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const translations = {
    english: {
      loading: 'Loading...',
      notAuthenticated: 'Authentication Required',
      notAuthenticatedDesc: 'Please sign in to access this page',
      signIn: 'Sign In',
      notArtisan: 'Artisan Access Required',
      notArtisanDesc: 'This page is only accessible to verified artisans',
      upgradeToArtisan: 'Become an Artisan',
    },
    hindi: {
      loading: 'लोड हो रहा है...',
      notAuthenticated: 'प्रमाणीकरण आवश्यक',
      notAuthenticatedDesc: 'इस पेज तक पहुंचने के लिए साइन इन करें',
      signIn: 'साइन इन करें',
      notArtisan: 'कारीगर एक्सेस आवश्यक',
      notArtisanDesc: 'यह पेज केवल सत्यापित कारीगरों के लिए उपलब्ध है',
      upgradeToArtisan: 'कारीगर बनें',
    },
    hinglish: {
      loading: 'Loading...',
      notAuthenticated: 'Authentication Zaroori Hai',
      notAuthenticatedDesc: 'Is page tak pahunchne ke liye sign in karo',
      signIn: 'Sign In karo',
      notArtisan: 'Artisan Access Zaroori Hai',
      notArtisanDesc: 'Ye page sirf verified artisans ke liye hai',
      upgradeToArtisan: 'Artisan bano',
    },
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
        <Card className="w-full max-w-md shadow-warm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">{t.loading}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
        <Card className="w-full max-w-md shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">{t.notAuthenticated}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {t.notAuthenticatedDesc}
            </p>
            <Link to={fallbackPath} state={{ from: location }}>
              <Button className="w-full">{t.signIn}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireArtisan && user?.role !== 'artisan') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background">
        <Card className="w-full max-w-md shadow-warm">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-warning/10 rounded-full">
                <Lock className="h-8 w-8 text-warning" />
              </div>
            </div>
            <CardTitle className="text-center">{t.notArtisan}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {t.notArtisanDesc}
            </p>
            <Link to="/dashboard">
              <Button className="w-full">{t.upgradeToArtisan}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
