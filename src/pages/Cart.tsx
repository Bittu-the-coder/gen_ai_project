import { LanguageToggle } from '@/components/LanguageToggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from '@/services/api/cart';
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  Heart,
  LogOut,
  Mic,
  Minus,
  Plus,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
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
      shoppingCart: 'Shopping Cart',
      backToMarketplace: 'Back to Marketplace',
      continueShopping: 'Continue Shopping',
      yourCart: 'Your Cart',
      items: 'items',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      free: 'Free',
      calculated: 'Calculated at checkout',
      emptyCart: 'Your cart is empty',
      emptyCartMessage: 'Add some beautiful handcrafted items to get started',
      remove: 'Remove',
      quantity: 'Quantity',
      addToWishlist: 'Add to Wishlist',
      couponCode: 'Coupon Code',
      applyCoupon: 'Apply Coupon',
      orderSummary: 'Order Summary',
      secureCheckout: 'Secure Checkout',
      freeShipping: 'Free shipping on orders over ₹999',
      securePayment: 'Secure payment processing',
      returnPolicy: '30-day return policy',
    },
    hindi: {
      shoppingCart: 'शॉपिंग कार्ट',
      backToMarketplace: 'बाज़ार में वापस जाएं',
      continueShopping: 'खरीदारी जारी रखें',
      yourCart: 'आपका कार्ट',
      items: 'आइटम',
      subtotal: 'उप-योग',
      shipping: 'शिपिंग',
      tax: 'कर',
      total: 'कुल',
      proceedToCheckout: 'चेकआउट के लिए आगे बढ़ें',
      free: 'मुफ्त',
      calculated: 'चेकआउट पर गणना की जाएगी',
      emptyCart: 'आपका कार्ट खाली है',
      emptyCartMessage: 'शुरू करने के लिए कुछ सुंदर हस्तशिल्प आइटम जोड़ें',
      remove: 'हटाएं',
      quantity: 'मात्रा',
      addToWishlist: 'विशलिस्ट में जोड़ें',
      couponCode: 'कूपन कोड',
      applyCoupon: 'कूपन लागू करें',
      orderSummary: 'ऑर्डर सारांश',
      secureCheckout: 'सुरक्षित चेकआउट',
      freeShipping: '₹999 से अधिक के ऑर्डर पर मुफ्त शिपिंग',
      securePayment: 'सुरक्षित पेमेंट प्रोसेसिंग',
      returnPolicy: '30-दिन वापसी नीति',
    },
    hinglish: {
      shoppingCart: 'Shopping Cart',
      backToMarketplace: 'Marketplace mein wapas jao',
      continueShopping: 'Shopping continue karo',
      yourCart: 'Aapka Cart',
      items: 'items',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      proceedToCheckout: 'Checkout ke liye proceed karo',
      free: 'Free',
      calculated: 'Checkout mein calculate hoga',
      emptyCart: 'Aapka cart empty hai',
      emptyCartMessage:
        'Kuch beautiful handcrafted items add karo to get started',
      remove: 'Remove',
      quantity: 'Quantity',
      addToWishlist: 'Wishlist mein add karo',
      couponCode: 'Coupon Code',
      applyCoupon: 'Coupon Apply karo',
      orderSummary: 'Order Summary',
      secureCheckout: 'Secure Checkout',
      freeShipping: '₹999 se upar ke orders pe free shipping',
      securePayment: 'Secure payment processing',
      returnPolicy: '30-day return policy',
    },
  };

  const t = translations[language];

  // Cart state management
  const [cartItems, setCartItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Load cart from backend
  useEffect(() => {
    const loadCart = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const cart = await getCart();
        setCartItems(cart.items || []);
      } catch (error) {
        console.error('Error loading cart:', error);
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const totalAmount = subtotal + shipping + tax;

  const updateQuantity = async (
    productId: string | number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const updatedCart = await updateCartQuantity(
        productId.toString(),
        newQuantity
      );
      setCartItems(updatedCart.items || []);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity');
    }
  };

  const removeItem = async (productId: string | number) => {
    try {
      const updatedCart = await removeFromCart(productId.toString());
      setCartItems(updatedCart.items || []);
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item');
    }
  };

  if (cartItems.length === 0) {
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
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t.emptyCart}</h2>
              <p className="text-muted-foreground mb-6">{t.emptyCartMessage}</p>
              <Link to="/marketplace">
                <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm">
                  {t.continueShopping}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {t.shoppingCart}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {t.items} in {t.yourCart.toLowerCase()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      {!item.inStock && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 text-xs"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {item.artisan}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {t.quantity}:
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId || item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e =>
                                updateQuantity(
                                  item.productId || item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.productId || item.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeItem(item.productId || item.id)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="text-center pt-4">
              <Link to="/marketplace">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.subtotal}</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.shipping}</span>
                  <span>{shipping === 0 ? t.free : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.tax}</span>
                  <span>₹{tax}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>{t.total}</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t.proceedToCheckout}
                </Button>
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t.couponCode}</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Enter coupon code" />
                    <Button variant="outline">{t.applyCoupon}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Truck className="h-4 w-4" />
                    <span>{t.freeShipping}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Shield className="h-4 w-4" />
                    <span>{t.securePayment}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Heart className="h-4 w-4" />
                    <span>{t.returnPolicy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
