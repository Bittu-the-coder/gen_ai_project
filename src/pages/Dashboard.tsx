import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, Plus, TrendingUp, Package, Users, Star, 
  Eye, Heart, ShoppingBag, BarChart3, Calendar, Edit 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import potteryImage from '@/assets/pottery-collection.jpg';

const Dashboard = () => {
  const [language, setLanguage] = React.useState<'english' | 'hindi' | 'hinglish'>('english');

  const translations = {
    english: {
      dashboard: "Artisan Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      products: "Products",
      analytics: "Analytics",
      profile: "Profile",
      addProduct: "Add New Product",
      totalProducts: "Total Products",
      totalSales: "Total Sales", 
      followers: "Followers",
      rating: "Average Rating",
      recentProducts: "Recent Products",
      salesThisMonth: "Sales This Month",
      viewsThisWeek: "Views This Week",
      pendingOrders: "Pending Orders",
      completedOrders: "Completed Orders",
      revenue: "Revenue",
      growth: "vs last month",
      edit: "Edit",
      delete: "Delete",
      active: "Active",
      draft: "Draft",
      outOfStock: "Out of Stock"
    },
    hindi: {
      dashboard: "कारीगर डैशबोर्ड",
      welcome: "वापसी पर स्वागत है",
      overview: "सिंहावलोकन",
      products: "उत्पाद",
      analytics: "विश्लेषण",
      profile: "प्रोफ़ाइल",
      addProduct: "नया उत्पाद जोड़ें",
      totalProducts: "कुल उत्पाद",
      totalSales: "कुल बिक्री",
      followers: "फॉलोअर्स",
      rating: "औसत रेटिंग",
      recentProducts: "हाल के उत्पाद",
      salesThisMonth: "इस महीने की बिक्री",
      viewsThisWeek: "इस सप्ताह के दृश्य",
      pendingOrders: "लंबित आदेश",
      completedOrders: "पूर्ण आदेश",
      revenue: "आय",
      growth: "पिछले महीने की तुलना में",
      edit: "संपादित करें",
      delete: "मिटाएं",
      active: "सक्रिय",
      draft: "मसौदा",
      outOfStock: "स्टॉक में नहीं"
    },
    hinglish: {
      dashboard: "Artisan Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      products: "Products",
      analytics: "Analytics", 
      profile: "Profile",
      addProduct: "New Product add karo",
      totalProducts: "Total Products",
      totalSales: "Total Sales",
      followers: "Followers",
      rating: "Average Rating",
      recentProducts: "Recent Products",
      salesThisMonth: "Is mahine ki Sales",
      viewsThisWeek: "Is week ke Views",
      pendingOrders: "Pending Orders",
      completedOrders: "Completed Orders",
      revenue: "Revenue",
      growth: "last month se",
      edit: "Edit",
      delete: "Delete",
      active: "Active",
      draft: "Draft",
      outOfStock: "Out of Stock"
    }
  };

  const t = translations[language];

  // Mock data
  const stats = {
    totalProducts: 24,
    totalSales: 892,
    followers: 1243,
    rating: 4.8,
    revenue: "₹45,670",
    growth: "+12%",
    pendingOrders: 8,
    completedOrders: 156
  };

  const recentProducts = [
    {
      id: 1,
      title: "Handcrafted Pottery Set",
      price: "₹2,999",
      image: potteryImage,
      status: "active",
      views: 234,
      likes: 18,
      sales: 12
    },
    {
      id: 2,
      title: "Terracotta Vase Collection", 
      price: "₹1,899",
      image: potteryImage,
      status: "active",
      views: 189,
      likes: 24,
      sales: 8
    },
    {
      id: 3,
      title: "Ceramic Dinner Set",
      price: "₹4,999", 
      image: potteryImage,
      status: "draft",
      views: 45,
      likes: 3,
      sales: 0
    },
    {
      id: 4,
      title: "Clay Water Pitcher",
      price: "₹599",
      image: potteryImage,
      status: "outOfStock",
      views: 67,
      likes: 9,
      sales: 15
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'outOfStock': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return t.active;
      case 'draft': return t.draft;
      case 'outOfStock': return t.outOfStock;
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
<nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Voice-to-Shop
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
            <Link to="/marketplace">
              <Button variant="outline">Marketplace</Button>
            </Link>
            <Button variant="outline">Logout</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                {t.dashboard}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">{t.welcome}, Priya Sharma!</p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
              <Plus className="h-4 w-4 mr-2" />
              {t.addProduct}
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>  
            <TabsTrigger value="products">{t.products}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.totalProducts}</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.totalSales}</p>
                      <p className="text-2xl font-bold">{stats.totalSales}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.followers}</p>
                      <p className="text-2xl font-bold">{stats.followers}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t.rating}</p>
                      <p className="text-2xl font-bold">{stats.rating}</p>
                    </div>
                    <Star className="h-8 w-8 text-accent fill-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue and Growth */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {t.revenue}
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.revenue}</div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-600 mr-1">{stats.growth}</span>
                    <span className="text-muted-foreground">{t.growth}</span>
                  </div>
                  <Progress value={68} className="mt-4" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.pendingOrders}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats.pendingOrders}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {stats.completedOrders} {t.completedOrders}
                  </div>
                  <Progress value={85} className="mt-4" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>{t.recentProducts}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">{product.price}</p>
                        <Badge 
                          variant={getStatusBadgeVariant(product.status)} 
                          className="mt-1"
                        >
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {product.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {product.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          {product.sales}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                  <p className="text-muted-foreground">Advanced product management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Detailed analytics and insights coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                  <p className="text-muted-foreground">Profile management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;