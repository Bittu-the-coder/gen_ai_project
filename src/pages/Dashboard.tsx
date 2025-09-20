import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Plus,
  TrendingUp,
  Package,
  Users,
  Star,
  Eye,
  Heart,
  ShoppingBag,
  BarChart3,
  Calendar,
  Edit,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  MapPin,
  Store,
  User,
  Menu,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  demoProducts,
  demoAnalytics,
  demoOrders,
  getDemoProductsForArtisan,
  isDemoMode,
  setDemoMode,
} from "@/services/demoData";
import potteryImage from "@/assets/pottery-collection.jpg";

const Dashboard = () => {
  const [language, setLanguage] = React.useState<
    "english" | "hindi" | "hinglish"
  >("english");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setDemoMode(false);
    navigate("/login");
  };

  const translations = {
    english: {
      dashboard: "Artisan Dashboard",
      welcome: "Welcome back, Priya!",
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
      outOfStock: "Out of Stock",
      revenueChart: "Revenue Trends",
      categoryPerformance: "Category Performance",
      topProducts: "Top Selling Products",
      orderStatus: "Order Status",
      customerDemographics: "Customer Demographics",
      monthlyViews: "Monthly Views & Visitors",
      conversionRate: "Conversion Rate",
      avgOrderValue: "Average Order Value",
      returnCustomers: "Return Customers",
      salesByLocation: "Sales by Location",
      ratingDistribution: "Rating Distribution",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      nav: {
        home: "Home",
        marketplace: "Marketplace",
        dashboard: "Dashboard",
        logout: "Logout",
      },
    },
    hindi: {
      dashboard: "कारीगर डैशबोर्ड",
      welcome: "वापसी पर स्वागत है, प्रिया!",
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
      outOfStock: "स्टॉक में नहीं",
      revenueChart: "आय रुझान",
      categoryPerformance: "श्रेणी प्रदर्शन",
      topProducts: "सबसे ज्यादा बिकने वाले उत्पाद",
      orderStatus: "आदेश स्थिति",
      customerDemographics: "ग्राहक जनसांख्यिकी",
      monthlyViews: "मासिक दृश्य और आगंतुक",
      conversionRate: "रूपांतरण दर",
      avgOrderValue: "औसत आदेश मूल्य",
      returnCustomers: "वापसी ग्राहक",
      salesByLocation: "स्थान के अनुसार बिक्री",
      ratingDistribution: "रेटिंग वितरण",
      thisMonth: "इस महीने",
      lastMonth: "पिछला महीना",
      daily: "दैनिक",
      weekly: "साप्ताहिक",
      monthly: "मासिक",
      nav: {
        home: "होम",
        marketplace: "बाज़ार",
        dashboard: "डैशबोर्ड",
        logout: "लॉगआउट",
      },
    },
    hinglish: {
      dashboard: "Artisan Dashboard",
      welcome: "Welcome back, Priya!",
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
      outOfStock: "Out of Stock",
      revenueChart: "Revenue ka Chart",
      categoryPerformance: "Category Performance",
      topProducts: "Top Selling Products",
      orderStatus: "Order Status",
      customerDemographics: "Customer Demographics",
      monthlyViews: "Monthly Views aur Visitors",
      conversionRate: "Conversion Rate",
      avgOrderValue: "Average Order Value",
      returnCustomers: "Return Customers",
      salesByLocation: "Location wise Sales",
      ratingDistribution: "Rating Distribution",
      thisMonth: "Is month",
      lastMonth: "Last month",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      nav: {
        home: "Home",
        marketplace: "Marketplace",
        dashboard: "Dashboard",
        logout: "Logout",
      },
    },
  };

  const t = translations[language];

  // Use demo data if in demo mode
  const isDemo = isDemoMode();
  const stats = isDemo
    ? {
        totalProducts: demoAnalytics.totalProducts,
        totalSales: demoAnalytics.totalSales,
        followers: demoAnalytics.followers,
        rating: demoAnalytics.averageRating,
        revenue: `₹${(demoAnalytics.salesThisMonth / 1000).toFixed(1)}k`,
        growth: `+${Math.round(
          ((demoAnalytics.salesThisMonth - demoAnalytics.salesLastMonth) /
            demoAnalytics.salesLastMonth) *
            100
        )}%`,
        pendingOrders: demoAnalytics.pendingOrders,
        completedOrders: demoAnalytics.completedOrders,
        conversionRate: demoAnalytics.conversionRate.current,
        avgOrderValue: demoAnalytics.averageOrderValue.current,
        returnCustomers: demoAnalytics.returnCustomers.percentage,
      }
    : {
        totalProducts: 24,
        totalSales: 892,
        followers: 1243,
        rating: 4.8,
        revenue: "₹45,670",
        growth: "+12%",
        pendingOrders: 8,
        completedOrders: 156,
        conversionRate: 2.8,
        avgOrderValue: 1634,
        returnCustomers: 28,
      };

  const recentProducts = isDemo
    ? getDemoProductsForArtisan()
        .slice(0, 4)
        .map((product) => ({
          id: product.id,
          title: product.name,
          price: `₹${product.price.toLocaleString()}`,
          image: product.image,
          status: product.status,
          views: product.views,
          likes: product.likes,
          sales: product.sold,
        }))
    : [
        {
          id: 1,
          title: "Handcrafted Pottery Set",
          price: "₹2,999",
          image: potteryImage,
          status: "active",
          views: 234,
          likes: 18,
          sales: 12,
        },
        {
          id: 2,
          title: "Terracotta Vase Collection",
          price: "₹1,899",
          image: potteryImage,
          status: "active",
          views: 189,
          likes: 24,
          sales: 8,
        },
        {
          id: 3,
          title: "Ceramic Dinner Set",
          price: "₹4,999",
          image: potteryImage,
          status: "draft",
          views: 45,
          likes: 3,
          sales: 0,
        },
        {
          id: 4,
          title: "Clay Water Pitcher",
          price: "₹599",
          image: potteryImage,
          status: "outOfStock",
          views: 67,
          likes: 9,
          sales: 15,
        },
      ];

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
    "#d084d0",
  ];

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(1)}k`;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "outOfStock":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t.active;
      case "draft":
        return t.draft;
      case "outOfStock":
        return t.outOfStock;
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Voice-to-Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>{t.nav.home}</span>
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <span>{t.nav.marketplace}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 bg-primary/10 text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{t.nav.dashboard}</span>
            </Button>
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.nav.logout}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>{t.nav.home}</span>
                  </Button>
                </Link>
                <Link
                  to="/marketplace"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Store className="h-4 w-4" />
                    <span>{t.nav.marketplace}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start flex items-center space-x-2 bg-primary/10 text-primary"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{t.nav.dashboard}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.nav.logout}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t.dashboard}</h1>
            <p className="text-gray-600 mt-1">{t.welcome}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            <Link to="/upload">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addProduct}
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
            <TabsTrigger value="products">{t.products}</TabsTrigger>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.totalProducts}
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3" />
                      +2 {t.thisMonth}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.revenue}
                  </CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3" />
                      {stats.growth} {t.growth}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.followers}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.followers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3" />
                      +45 {t.thisMonth}
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t.rating}
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {stats.rating}
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {isDemo ? "344" : "256"} reviews
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            {isDemo && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.revenueChart}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={demoAnalytics.revenue.monthly.map(
                        (value, index) => ({
                          month: demoAnalytics.revenue.labels.monthly[index],
                          revenue: value,
                        })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Revenue",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>{t.recentProducts}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{product.title}</h4>
                            <p className="text-sm text-gray-600">
                              {product.price}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(product.status)}
                          >
                            {getStatusText(product.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {product.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {product.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            {product.sales} sold
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {isDemo && (
              <>
                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {t.conversionRate}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.conversionRate}%
                      </div>
                      <p className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        +0.4% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {t.avgOrderValue}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{stats.avgOrderValue}
                      </div>
                      <p className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        +₹213 from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {t.returnCustomers}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.returnCustomers}%
                      </div>
                      <p className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="h-3 w-3" />
                        +6% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.categoryPerformance}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demoAnalytics.categoryPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Order Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.orderStatus}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={demoAnalytics.orderStatus}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            label={({ status, percentage }) =>
                              `${status} (${percentage}%)`
                            }
                          >
                            {demoAnalytics.orderStatus.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Customer Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.customerDemographics}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demoAnalytics.customerDemographics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Sales by Location */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.salesByLocation}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demoAnalytics.salesByLocation}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="state" />
                          <YAxis tickFormatter={formatCurrency} />
                          <Tooltip
                            formatter={(value) => [
                              formatCurrency(value as number),
                              "Revenue",
                            ]}
                          />
                          <Bar dataKey="revenue" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Monthly Views */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>{t.monthlyViews}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={demoAnalytics.monthlyViews}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#8884d8"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="uniqueVisitors"
                            stroke="#82ca9d"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Products Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.topProducts}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {demoAnalytics.topProducts.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.sales} units sold
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ₹{product.revenue.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Products</h2>
              <Link to="/upload">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 rounded-lg object-cover mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{product.title}</h3>
                        <Badge variant={getStatusBadgeVariant(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {product.price}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{product.views} views</span>
                        <span>{product.likes} likes</span>
                        <span>{product.sales} sold</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Artisan Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <img
                    src={potteryImage}
                    alt="Priya Sharma"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">Priya Sharma</h3>
                    <p className="text-gray-600">Master Potter</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      Jaipur, Rajasthan
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{stats.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {stats.followers} followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-gray-600">
                    Master potter with 15 years of experience specializing in
                    traditional Rajasthani blue pottery. Known for combining
                    traditional techniques with modern designs to create unique,
                    functional art pieces.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Specialities</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Blue Pottery",
                      "Decorative Vases",
                      "Kitchen Sets",
                      "Garden Planters",
                    ].map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
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
