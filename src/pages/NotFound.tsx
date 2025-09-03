import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-6">
          <Mic className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/">
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="outline">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
