import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Languages,
  Star,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";
import artisanImage from "@/assets/artisan-priya.jpg";
import potteryImage from "@/assets/pottery-collection.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { VoiceUpload } from "@/components/VoiceUpload";
import { ArtisanCard } from "@/components/ArtisanCard";
import { ProductCard } from "@/components/ProductCard";

const Index = () => {
  const [language, setLanguage] = React.useState<
    "english" | "hindi" | "hinglish"
  >("english");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const translations = {
    english: {
      hero: {
        title: "Voice-to-Shop",
        subtitle: "AI-Powered Marketplace for Local Artisans",
        description:
          "Empowering artisans to sell globally with just a voice note. AI creates your product story, descriptions, and social media content in 60 seconds.",
      },
      nav: {
        home: "Home",
        marketplace: "Marketplace",
        login: "Login",
        sellNow: "Sell Now",
        browseMarketplace: "Browse Marketplace",
      },
      cta: "Start Selling with Voice",
      featured: "Featured Artisans",
      products: "Latest Products",
    },
    hindi: {
      hero: {
        title: "आवाज़-से-दुकान",
        subtitle: "स्थानीय कारीगरों के लिए AI-संचालित बाज़ार",
        description:
          "कारीगरों को केवल एक आवाज़ के नोट से विश्वव्यापी बिक्री में सशक्त बनाना। AI 60 सेकंड में आपकी उत्पाद कहानी, विवरण और सोशल मीडिया सामग्री बनाता है।",
      },
      nav: {
        home: "होम",
        marketplace: "बाज़ार",
        login: "लॉगिन",
        sellNow: "अभी बेचें",
        browseMarketplace: "बाज़ार देखें",
      },
      cta: "आवाज़ के साथ बेचना शुरू करें",
      featured: "विशेष कारीगर",
      products: "नवीनतम उत्पाद",
    },
    hinglish: {
      hero: {
        title: "Voice-to-Shop",
        subtitle: "Local Artisans ke liye AI-powered Marketplace",
        description:
          "Artisans ko sirf ek voice note se global selling mein empower karna. AI 60 seconds mein aapki product story, descriptions aur social media content banata hai.",
      },
      nav: {
        home: "Home",
        marketplace: "Marketplace",
        login: "Login",
        sellNow: "Sell Now",
        browseMarketplace: "Browse Marketplace",
      },
      cta: "Voice ke saath selling start karo",
      featured: "Featured Artisans",
      products: "Latest Products",
    },
  };

  const t = translations[language];

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
                <span>{t.nav.home}</span>
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Store className="h-4 w-4" />
                <span>{t.nav.marketplace}</span>
              </Button>
            </Link>
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
            />
            <Link to="/login">
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{t.nav.login}</span>
              </Button>
            </Link>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                <Mic className="h-4 w-4 mr-2" />
                {t.nav.sellNow}
              </Button>
            </Link>
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
                  <Button variant="ghost" className="w-full justify-start">
                    {t.nav.home}
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
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{t.nav.login}</span>
                  </Button>
                </Link>
                <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-glow">
                    <Mic className="h-4 w-4 mr-2" />
                    {t.nav.sellNow}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Mic className="h-4 w-4 mr-2" />
                60-Second AI Magic
              </Badge>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    {t.hero.title}
                  </span>
                </h1>
                <h2 className="text-2xl text-muted-foreground font-medium">
                  {t.hero.subtitle}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t.hero.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-warm text-lg py-6 px-8"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    {t.cta}
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="py-6 px-8">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {t.nav.browseMarketplace}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-accent/20 blur-2xl"></div>
              <img
                src={heroImage}
                alt="Indian artisan marketplace with handmade crafts"
                className="relative rounded-2xl shadow-warm w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voice Upload Demo */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Try Voice-to-Shop Demo</h3>
            <p className="text-muted-foreground text-lg">
              Record a voice note about your product and see AI magic in action
            </p>
          </div>
          <VoiceUpload />
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t.featured}</h3>
            <p className="text-muted-foreground text-lg">
              Meet the talented craftspeople behind our beautiful products
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/artisan/priya-sharma">
              <ArtisanCard
                name="Priya Sharma"
                craft="Traditional Pottery"
                location="Jaipur, Rajasthan"
                image={artisanImage}
                story="Creating beautiful pottery for over 15 years, following ancient techniques passed down through generations."
                language={language}
              />
            </Link>
            <Link to="/artisan/arjun-kumar">
              <ArtisanCard
                name="Arjun Kumar"
                craft="Handwoven Textiles"
                location="Varanasi, UP"
                image={artisanImage}
                story="Master weaver specializing in silk fabrics with intricate patterns inspired by Mughal artistry."
                language={language}
              />
            </Link>
            <Link to="/artisan/meera-devi">
              <ArtisanCard
                name="Meera Devi"
                craft="Wooden Handicrafts"
                location="Kashmir"
                image={artisanImage}
                story="Expert wood carver creating unique decorative pieces using traditional Kashmiri techniques."
                language={language}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t.products}</h3>
            <p className="text-muted-foreground text-lg">
              Discover unique handcrafted items with their voice stories
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/product/1">
              <ProductCard
                title="Handcrafted Pottery Set"
                price="₹2,999"
                artisan="Priya Sharma"
                image={potteryImage}
                voiceStory="Made with love using traditional clay..."
                language={language}
              />
            </Link>
            <Link to="/product/2">
              <ProductCard
                title="Silk Scarf Collection"
                price="₹1,599"
                artisan="Arjun Kumar"
                image={potteryImage}
                voiceStory="Each thread tells a story of ancient artistry..."
                language={language}
              />
            </Link>
            <Link to="/product/3">
              <ProductCard
                title="Wooden Jewelry Box"
                price="₹3,499"
                artisan="Meera Devi"
                image={potteryImage}
                voiceStory="Carved with intricate patterns from Kashmir..."
                language={language}
              />
            </Link>
            <Link to="/product/4">
              <ProductCard
                title="Ceramic Dinner Set"
                price="₹4,999"
                artisan="Priya Sharma"
                image={potteryImage}
                voiceStory="Perfect for family gatherings and special occasions..."
                language={language}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Mic className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Voice-to-Shop
              </span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Empowering artisans worldwide with AI-powered storytelling
            </p>
            <div className="flex justify-center space-x-6 flex-wrap">
              <Link to="/marketplace">
                <Button variant="ghost">{t.nav.marketplace}</Button>
              </Link>
              <Link to="/upload">
                <Button variant="ghost">Start Selling</Button>
              </Link>
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Contact</Button>
              <Button variant="ghost">Help</Button>
              <Button variant="ghost">Privacy</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
