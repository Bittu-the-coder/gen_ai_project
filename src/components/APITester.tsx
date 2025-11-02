import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const APITester = () => {
  const [apiStatus, setApiStatus] = useState({
    health: 'loading',
    auth: 'loading',
    products: 'loading',
  });

  const [responses, setResponses] = useState({});

  const testHealthEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/health');
      const data = await response.json();
      setApiStatus(prev => ({ ...prev, health: 'success' }));
      setResponses(prev => ({ ...prev, health: data }));
    } catch (error) {
      setApiStatus(prev => ({ ...prev, health: 'error' }));
      setResponses(prev => ({ ...prev, health: error.message }));
    }
  };

  const testProductsEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/products');
      const data = await response.json();
      setApiStatus(prev => ({ ...prev, products: 'success' }));
      setResponses(prev => ({ ...prev, products: data }));
    } catch (error) {
      setApiStatus(prev => ({ ...prev, products: 'error' }));
      setResponses(prev => ({ ...prev, products: error.message }));
    }
  };

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/login');
      const data = await response.json();
      setApiStatus(prev => ({ ...prev, auth: 'success' }));
      setResponses(prev => ({ ...prev, auth: data }));
    } catch (error) {
      setApiStatus(prev => ({ ...prev, auth: 'error' }));
      setResponses(prev => ({ ...prev, auth: error.message }));
    }
  };

  const testAllEndpoints = () => {
    setApiStatus({
      health: 'loading',
      auth: 'loading',
      products: 'loading',
    });
    testHealthEndpoint();
    testProductsEndpoint();
    testAuthEndpoint();
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'loading':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  useEffect(() => {
    testAllEndpoints();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔌 API Integration Test
            <Button onClick={testAllEndpoints} size="sm" variant="outline">
              Refresh Tests
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Testing connection between React frontend (port 5173) and Node.js
              backend (port 3001)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className={`${getStatusColor(apiStatus.health)}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              {getStatusIcon(apiStatus.health)}
              Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">GET /api/v1/health</p>
            <p className="text-xs mt-1">
              Status: <span className="font-mono">{apiStatus.health}</span>
            </p>
          </CardContent>
        </Card>

        <Card className={`${getStatusColor(apiStatus.products)}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              {getStatusIcon(apiStatus.products)}
              Products API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">GET /api/v1/products</p>
            <p className="text-xs mt-1">
              Status: <span className="font-mono">{apiStatus.products}</span>
            </p>
          </CardContent>
        </Card>

        <Card className={`${getStatusColor(apiStatus.auth)}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              {getStatusIcon(apiStatus.auth)}
              Auth API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">GET /api/v1/auth/login</p>
            <p className="text-xs mt-1">
              Status: <span className="font-mono">{apiStatus.auth}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Details */}
      <div className="space-y-4">
        {Object.entries(responses).map(([endpoint, response]) => (
          <Card key={endpoint}>
            <CardHeader>
              <CardTitle className="text-sm">
                {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {typeof response === 'string'
                  ? response
                  : JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default APITester;
