import artisanImage from '@/assets/artisan-priya.jpg';
import potteryImage from '@/assets/pottery-collection.jpg';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { addToCart } from '@/services/api/cart';
import {
  ArrowLeft,
  BarChart3,
  Heart,
  LogOut,
  MapPin,
  Mic,
  Play,
  Share2,
  ShoppingCart,
  Star,
  User,
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [language, setLanguage] = React.useState<
    'english' | 'hindi' | 'hinglish'
  >('english');
  const [addingToCart, setAddingToCart] = React.useState(false);
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

  // Cart product data - simplified for cart API
  const cartProduct = {
    id: id || '1',
    name: 'Handcrafted Pottery Set',
    price: 2999,
    image: potteryImage,
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(
        cartProduct.id,
        1, // quantity
        cartProduct.price,
        cartProduct.name,
        cartProduct.image
      );
      // Show success message or redirect to cart
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const translations = {
    english: {
      backToMarketplace: 'Back to Marketplace',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      voiceStory: 'Voice Story',
      playStory: 'Play Story',
      aboutArtisan: 'About the Artisan',
      specifications: 'Specifications',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
      handmade: 'Handmade',
      authentic: 'Authentic',
      traditionalCraft: 'Traditional Craft',
      freeShipping: 'Free Shipping',
      returnPolicy: '30-day Return Policy',
      artisanStory: "Artisan's Story",
    },
    hindi: {
      backToMarketplace: 'बाज़ार में वापस जाएं',
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      voiceStory: 'आवाज़ की कहानी',
      playStory: 'कहानी सुनें',
      aboutArtisan: 'कारीगर के बारे में',
      specifications: 'विशेषताएं',
      reviews: 'समीक्षाएं',
      relatedProducts: 'संबंधित उत्पाद',
      handmade: 'हस्तनिर्मित',
      authentic: 'प्रामाणिक',
      traditionalCraft: 'पारंपरिक शिल्प',
      freeShipping: 'मुफ्त शिपिंग',
      returnPolicy: '30-दिन वापसी नीति',
      artisanStory: 'कारीगर की कहानी',
    },
    hinglish: {
      backToMarketplace: 'Marketplace mein wapas jao',
      addToCart: 'Cart mein add karo',
      buyNow: 'Abhi buy karo',
      voiceStory: 'Voice Story',
      playStory: 'Story suno',
      aboutArtisan: 'Artisan ke baare mein',
      specifications: 'Specifications',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
      handmade: 'Handmade',
      authentic: 'Authentic',
      traditionalCraft: 'Traditional Craft',
      freeShipping: 'Free Shipping',
      returnPolicy: '30-day Return Policy',
      artisanStory: 'Artisan ki Story',
    },
  };

  const t = translations[language];

  // Mock product data - in real app, fetch by ID
  const product = {
    id: id,
    title: 'Handcrafted Pottery Set',
    price: '₹2,999',
    originalPrice: '₹3,999',
    artisan: {
      name: 'Priya Sharma',
      location: 'Jaipur, Rajasthan',
      image: artisanImage,
      rating: 4.8,
      story:
        'Creating beautiful pottery for over 15 years, following ancient techniques passed down through generations.',
    },
    images: [potteryImage, potteryImage, potteryImage],
    voiceStory:
      'Made with love using traditional clay from the banks of river Yamuna. Each piece is hand-thrown and fired in our traditional kiln, giving it that authentic rustic charm that you can only get from genuine handmade pottery.',
    description:
      'This beautiful pottery set includes 6 bowls, 6 plates, and a serving tray, all handcrafted using traditional techniques. The earthy tones and natural textures make each piece unique and perfect for both everyday use and special occasions.',
    specifications: [
      { label: 'Material', value: 'Natural Clay' },
      { label: 'Set Includes', value: '6 Bowls, 6 Plates, 1 Tray' },
      { label: 'Care Instructions', value: 'Hand wash only' },
      { label: 'Origin', value: 'Jaipur, Rajasthan' },
    ],
    tags: ['handmade', 'authentic', 'traditional'],
    rating: 4.6,
    reviews: 24,
  };

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
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-4 w-4" />
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
                <Link to="/cart">
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </Link>
              </>
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {t[tag as keyof typeof t] || tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {product.price}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Voice Story */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{t.voiceStory}</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {product.voiceStory}
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {t.playStory}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? 'Adding...' : t.addToCart}
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                {t.buyNow}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>✓ {t.freeShipping}</span>
              <span>✓ {t.returnPolicy}</span>
              <span>✓ {t.authentic}</span>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Artisan Info & Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* About Artisan */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t.aboutArtisan}</h3>
              <div className="flex items-start gap-4">
                <img
                  src={product.artisan.image}
                  alt={product.artisan.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{product.artisan.name}</h4>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.artisan.location}
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 fill-accent text-accent mr-1" />
                    <span className="font-medium">
                      {product.artisan.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.artisan.story}
                  </p>
                  <Link to={`/artisan/priya-sharma`}>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t.specifications}</h3>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">{spec.label}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
