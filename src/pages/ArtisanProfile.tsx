import artisanImage from '@/assets/artisan-priya.jpg';
import potteryImage from '@/assets/pottery-collection.jpg';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProductCard } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Heart,
  LogOut,
  MapPin,
  Mic,
  Share2,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ArtisanProfile = () => {
  const { id } = useParams();
  const [language, setLanguage] = React.useState<
    'english' | 'hindi' | 'hinglish'
  >('english');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const translations = {
    english: {
      backToMarketplace: 'Back to Marketplace',
      follow: 'Follow',
      message: 'Message',
      products: 'Products',
      about: 'About',
      reviews: 'Reviews',
      craftsmanship: 'Craftsmanship',
      yearsExperience: 'Years Experience',
      followers: 'Followers',
      totalSales: 'Total Sales',
      rating: 'Rating',
      specialties: 'Specialties',
      achievements: 'Achievements',
      memberSince: 'Member Since',
      location: 'Location',
      aboutArtisan: 'About the Artisan',
      featuredProducts: 'Featured Products',
      allProducts: 'All Products',
    },
    hindi: {
      backToMarketplace: 'बाज़ार में वापस जाएं',
      follow: 'फॉलो करें',
      message: 'संदेश',
      products: 'उत्पाद',
      about: 'बारे में',
      reviews: 'समीक्षाएं',
      craftsmanship: 'शिल्पकारी',
      yearsExperience: 'वर्षों का अनुभव',
      followers: 'फॉलोअर्स',
      totalSales: 'कुल बिक्री',
      rating: 'रेटिंग',
      specialties: 'विशेषताएं',
      achievements: 'उपलब्धियां',
      memberSince: 'सदस्य बने',
      location: 'स्थान',
      aboutArtisan: 'कारीगर के बारे में',
      featuredProducts: 'विशेष उत्पाद',
      allProducts: 'सभी उत्पाद',
    },
    hinglish: {
      backToMarketplace: 'Marketplace mein wapas jao',
      follow: 'Follow karo',
      message: 'Message',
      products: 'Products',
      about: 'About',
      reviews: 'Reviews',
      craftsmanship: 'Craftsmanship',
      yearsExperience: 'Years Experience',
      followers: 'Followers',
      totalSales: 'Total Sales',
      rating: 'Rating',
      specialties: 'Specialties',
      achievements: 'Achievements',
      memberSince: 'Member Since',
      location: 'Location',
      aboutArtisan: 'Artisan ke baare mein',
      featuredProducts: 'Featured Products',
      allProducts: 'All Products',
    },
  };

  const t = translations[language];

  // Mock artisan data
  const artisan = {
    id: id,
    name: 'Priya Sharma',
    craft: 'Traditional Pottery',
    location: 'Jaipur, Rajasthan',
    image: artisanImage,
    coverImage: potteryImage,
    rating: 4.8,
    reviews: 156,
    followers: 1243,
    yearsExperience: 15,
    totalSales: 892,
    memberSince: 'March 2021',
    story:
      'Creating beautiful pottery for over 15 years, following ancient techniques passed down through generations. My grandmother taught me the art of clay spinning when I was just 8 years old, and since then, every piece I create carries the soul of our ancestral craft.',
    fullStory:
      "Born and raised in the heart of Jaipur, I learned the ancient art of pottery from my grandmother, who was herself a renowned potter in our village. For over 15 years, I have been dedicating my life to preserving and promoting traditional Indian pottery techniques. Each piece I create is hand-thrown on a traditional potter's wheel, fired in a wood-burning kiln, and finished with natural glazes made from local materials. My work represents not just a craft, but a cultural heritage that I am proud to carry forward for future generations.",
    specialties: [
      'Traditional Clay Pottery',
      'Terracotta Art',
      'Decorative Vases',
      'Dinnerware Sets',
    ],
    achievements: [
      'Winner - National Handicrafts Award 2022',
      'Featured in Craft Magazine India',
      'UNESCO Intangible Heritage Recognition',
      'Master Artisan Certification',
    ],
    products: [
      {
        id: 1,
        title: 'Handcrafted Pottery Set',
        price: '₹2,999',
        image: potteryImage,
        voiceStory: 'Made with love using traditional clay...',
        featured: true,
      },
      {
        id: 2,
        title: 'Terracotta Vase Collection',
        price: '₹1,899',
        image: potteryImage,
        voiceStory: 'Each vase tells a story of ancient artistry...',
        featured: true,
      },
      {
        id: 4,
        title: 'Ceramic Dinner Set',
        price: '₹4,999',
        image: potteryImage,
        voiceStory: 'Perfect for family gatherings...',
        featured: false,
      },
      {
        id: 5,
        title: 'Decorative Clay Bowls',
        price: '₹799',
        image: potteryImage,
        voiceStory: 'Hand-painted with traditional motifs...',
        featured: false,
      },
    ],
  };

  const featuredProducts = artisan.products.filter(p => p.featured);
  const allProducts = artisan.products;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Voice-to-Shop
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            {user ? (
              // Authenticated user navigation
              <>
                <Link to="/cart">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Cart</span>
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              // Non-authenticated user navigation
              <Link to="/login">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/marketplace">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.backToMarketplace}
            </Button>
          </Link>
        </div>

        {/* Cover Image */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <img
            src={artisan.coverImage}
            alt={`${artisan.name} workshop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-32 h-32 rounded-full border-4 border-background object-cover shadow-warm"
              />
              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary/90 text-primary-foreground">
                {artisan.craft}
              </Badge>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-2">{artisan.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{artisan.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.yearsExperience}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.yearsExperience}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.followers}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.followers}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.totalSales}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.totalSales}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-2xl font-bold text-primary">
                      {artisan.rating}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.rating}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
                <Heart className="h-4 w-4 mr-2" />
                {t.follow}
              </Button>
              <Button variant="outline">{t.message}</Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">{t.about}</TabsTrigger>
            <TabsTrigger value="products">{t.products}</TabsTrigger>
            <TabsTrigger value="reviews">{t.reviews}</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* About */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {t.aboutArtisan}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {artisan.story}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {artisan.fullStory}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Specialties */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">{t.specialties}</h4>
                    <div className="flex flex-wrap gap-2">
                      {artisan.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      {t.achievements}
                    </h4>
                    <ul className="space-y-2">
                      {artisan.achievements.map((achievement, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Member Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t.memberSince}:
                        </span>
                        <span className="font-medium">
                          {artisan.memberSince}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t.location}:
                        </span>
                        <span className="font-medium">{artisan.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <h3 className="text-xl font-semibold mb-6">
                {t.featuredProducts}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <ProductCard
                      title={product.title}
                      price={product.price}
                      artisan={artisan.name}
                      image={product.image}
                      voiceStory={product.voiceStory}
                      language={language}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{t.allProducts}</h3>
              <p className="text-muted-foreground">
                {allProducts.length} products
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductCard
                    title={product.title}
                    price={product.price}
                    artisan={artisan.name}
                    image={product.image}
                    voiceStory={product.voiceStory}
                    language={language}
                  />
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Reviews Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Customer reviews will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtisanProfile;
