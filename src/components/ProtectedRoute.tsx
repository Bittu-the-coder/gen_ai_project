import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, User, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireArtisan?: boolean;
  fallbackPath?: string;
  language?: "english" | "hindi" | "hinglish";
}

// Mock authentication state - replace with actual auth context/state
const useAuth = () => {
  // This would typically come from your auth context/provider
  const [authState, setAuthState] = React.useState({
    isLoading: true,
    isAuthenticated: false,
    user: null as any,
    isArtisan: false,
  });

  // Simulate auth loading and check for demo auth
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for demo authentication
        const demoAuth = localStorage.getItem("demoAuth");
        if (demoAuth) {
          const parsedAuth = JSON.parse(demoAuth);
          setAuthState({
            isLoading: false,
            isAuthenticated: parsedAuth.isAuthenticated,
            user: parsedAuth.user,
            isArtisan: parsedAuth.isArtisan,
          });
          return;
        }

        // Check for regular authentication (implement your actual auth logic here)
        // For now, default to not authenticated
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          isArtisan: false,
        }));
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          isArtisan: false,
        }));
      }
    };

    checkAuth();
  }, []);

  return authState;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireArtisan = false,
  fallbackPath = "/login",
  language = "english",
}) => {
  const { isLoading, isAuthenticated, isArtisan } = useAuth();
  const location = useLocation();

  const translations = {
    english: {
      loading: "Loading...",
      authRequired: "Authentication Required",
      authRequiredDesc: "You need to be logged in to access this page.",
      artisanRequired: "Artisan Access Required",
      artisanRequiredDesc:
        "This page is only accessible to registered artisans.",
      loginButton: "Go to Login",
      homeButton: "Go to Home",
      becomeArtisan: "Become an Artisan",
    },
    hindi: {
      loading: "लोड हो रहा है...",
      authRequired: "प्रमाणीकरण आवश्यक",
      authRequiredDesc: "इस पेज को एक्सेस करने के लिए आपको लॉग इन होना होगा।",
      artisanRequired: "कारीगर पहुंच आवश्यक",
      artisanRequiredDesc: "यह पेज केवल पंजीकृत कारीगरों के लिए सुलभ है।",
      loginButton: "लॉगिन पर जाएं",
      homeButton: "होम पर जाएं",
      becomeArtisan: "कारीगर बनें",
    },
    hinglish: {
      loading: "Loading...",
      authRequired: "Authentication Required",
      authRequiredDesc:
        "Is page ko access karne ke liye aapko login hona hoga.",
      artisanRequired: "Artisan Access Required",
      artisanRequiredDesc:
        "Yeh page sirf registered artisans ke liye accessible hai.",
      loginButton: "Login par jao",
      homeButton: "Home par jao",
      becomeArtisan: "Artisan bano",
    },
  };

  const t = translations[language];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">{t.loading}</span>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>{t.authRequired}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{t.authRequiredDesc}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to={fallbackPath}
                state={{ from: location }}
                className="flex-1"
              >
                <Button className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  {t.loginButton}
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  {t.homeButton}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check artisan requirement
  if (requireArtisan && isAuthenticated && !isArtisan) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>{t.artisanRequired}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{t.artisanRequiredDesc}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="flex-1">
                <User className="h-4 w-4 mr-2" />
                {t.becomeArtisan}
              </Button>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  {t.homeButton}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Higher-order component for easier usage
export const withProtection = (
  Component: React.ComponentType<any>,
  options: Omit<ProtectedRouteProps, "children">
) => {
  return (props: any) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
