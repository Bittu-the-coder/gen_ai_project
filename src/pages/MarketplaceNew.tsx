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
import { useToast } from '@/hooks/use-toast';
import { Product, productsApi } from '@/services/api';
import { Filter, Loader2, Mic, Search, ShoppingBag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [language, setLanguage] = useState<'english' | 'hindi' | 'hinglish'>(
    'english'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

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
      loading: 'Loading products...',
      error: 'Failed to load products',
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
      loading: 'उत्पाद लोड हो रहे हैं...',
      error: 'उत्पाद लोड करने में विफल',
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
      loading: 'Products load ho rahe hain...',
      error: 'Products load karne mein problem',
    },
  };

  const t = translations[language];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: {
          page: number;
          limit: number;
          category?: string;
          search?: string;
        } = {
          page,
          limit: 20,
        };

        if (category !== 'all') {
          params.category = category;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await productsApi.getProducts(params);
        setProducts(response.data);
        setHasMore(response.has_more);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: t.error,
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category, searchQuery, toast, t.error]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              VoiceCraft Market
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
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                Sell Now
              </Button>
            </Link>
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
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t.search}
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
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
            </form>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {loading ? t.loading : `${products.length} ${t.results}`}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Marketplace
            </Badge>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <ProductCard
                  title={product.title}
                  price={`₹${product.price.toLocaleString()}`}
                  artisan={product.artisan_id} // We'll need to fetch artisan name separately or join in backend
                  image={product.images[0] || '/placeholder-product.jpg'}
                  voiceStory={
                    product.voice_story?.transcript || product.description
                  }
                  language={language}
                />
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setPage(p => p + 1)}
              variant="outline"
              size="lg"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
