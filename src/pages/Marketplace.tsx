import potteryImage from '@/assets/pottery-collection.jpg';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ProductCard } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { demoProducts, isDemoMode } from '@/services/demoData';
import {
  BarChart3,
  Filter,
  LogOut,
  Mic,
  Search,
  ShoppingBag,
  User,
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Marketplace = () => {
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
      title: 'Artisan Marketplace',
      subtitle:
        'Discover authentic handcrafted products with their voice stories',
      search: 'Search products...',
      filter: 'Filter',
      category: 'Category',
      priceRange: 'Price Range',
      allCategories: 'All Categories',
      pottery: 'Pottery',
      textiles: 'Textiles',
      woodcraft: 'Woodcraft',
      jewelry: 'Jewelry',
      metalwork: 'Metalwork',
      leatherwork: 'Leather Work',
      weaving: 'Weaving',
      stonework: 'Stone Work',
      glasswork: 'Glass Work',
      results: 'products found',
    },
    hindi: {
      title: 'कारीगर बाज़ार',
      subtitle:
        'अपनी आवाज़ की कहानियों के साथ प्रामाणिक हस्तशिल्प उत्पादों की खोज करें',
      search: 'उत्पाद खोजें...',
      filter: 'फ़िल्टर',
      category: 'श्रेणी',
      priceRange: 'मूल्य सीमा',
      allCategories: 'सभी श्रेणियां',
      pottery: 'मिट्टी के बर्तन',
      textiles: 'वस्त्र',
      woodcraft: 'लकड़ी का काम',
      jewelry: 'आभूषण',
      metalwork: 'धातु का काम',
      leatherwork: 'चमड़े का काम',
      weaving: 'बुनाई',
      stonework: 'पत्थर का काम',
      glasswork: 'कांच का काम',
      results: 'उत्पाद मिले',
    },
    hinglish: {
      title: 'Artisan Marketplace',
      subtitle:
        'Voice stories ke saath authentic handcrafted products discover karo',
      search: 'Products search karo...',
      filter: 'Filter',
      category: 'Category',
      priceRange: 'Price Range',
      allCategories: 'All Categories',
      pottery: 'Pottery',
      textiles: 'Textiles',
      woodcraft: 'Woodcraft',
      jewelry: 'Jewelry',
      metalwork: 'Metalwork',
      leatherwork: 'Leather Work',
      weaving: 'Weaving',
      stonework: 'Stone Work',
      glasswork: 'Glass Work',
      results: 'products mile',
    },
  };

  const t = translations[language];

  // Use demo data if available, otherwise fallback to static data
  const isDemo = isDemoMode();
  const products = isDemo
    ? demoProducts.map(product => ({
        id: product.id,
        title: product.name,
        price: `₹${product.price.toLocaleString()}`,
        artisan: product.artisan,
        image: product.image,
        voiceStory:
          product.voiceStory || `Discover the story behind ${product.name}...`,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        location: product.location,
      }))
    : [
        {
          id: 1,
          title: 'Handcrafted Pottery Set',
          price: '₹2,999',
          artisan: 'Priya Sharma',
          image: potteryImage,
          voiceStory: 'Made with love using traditional clay...',
          category: 'pottery',
          rating: 4.8,
          reviews: 156,
          location: 'Jaipur, Rajasthan',
        },
        {
          id: 2,
          title: 'Silk Scarf Collection',
          price: '₹1,599',
          artisan: 'Arjun Kumar',
          image: potteryImage,
          voiceStory: 'Each thread tells a story of ancient artistry...',
          category: 'textiles',
          rating: 4.6,
          reviews: 89,
          location: 'Delhi',
        },
        {
          id: 3,
          title: 'Wooden Jewelry Box',
          price: '₹3,499',
          artisan: 'Meera Devi',
          image: potteryImage,
          voiceStory: 'Carved with intricate patterns from Kashmir...',
          category: 'woodcraft',
          rating: 4.7,
          reviews: 124,
          location: 'Kashmir',
        },
        {
          id: 4,
          title: 'Ceramic Dinner Set',
          price: '₹4,999',
          artisan: 'Priya Sharma',
          image: potteryImage,
          voiceStory: 'Perfect for family gatherings and special occasions...',
          category: 'pottery',
          rating: 4.9,
          reviews: 203,
          location: 'Jaipur, Rajasthan',
        },
        {
          id: 5,
          title: 'Handwoven Table Runner',
          price: '₹899',
          artisan: 'Arjun Kumar',
          image: potteryImage,
          voiceStory: 'Traditional patterns woven with care...',
          category: 'textiles',
          rating: 4.5,
          reviews: 67,
          location: 'Delhi',
        },
        {
          id: 6,
          title: 'Carved Wooden Mirror',
          price: '₹2,299',
          artisan: 'Meera Devi',
          image: potteryImage,
          voiceStory: 'Handcarved beauty for your home...',
          category: 'woodcraft',
          rating: 4.6,
          reviews: 92,
          location: 'Kashmir',
        },
      ];

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
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                    Sell Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder={t.search} className="pl-10" />
              </div>

              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allCategories}</SelectItem>
                  <SelectItem value="pottery">{t.pottery}</SelectItem>
                  <SelectItem value="textiles">{t.textiles}</SelectItem>
                  <SelectItem value="woodcraft">{t.woodcraft}</SelectItem>
                  <SelectItem value="jewelry">{t.jewelry}</SelectItem>
                  <SelectItem value="metalwork">{t.metalwork}</SelectItem>
                  <SelectItem value="leatherwork">{t.leatherwork}</SelectItem>
                  <SelectItem value="weaving">{t.weaving}</SelectItem>
                  <SelectItem value="stonework">{t.stonework}</SelectItem>
                  <SelectItem value="glasswork">{t.glasswork}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t.filter}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {products.length} {t.results}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Marketplace
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard
                title={product.title}
                price={product.price}
                artisan={product.artisan}
                image={product.image}
                voiceStory={product.voiceStory}
                language={language}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
