import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Mic, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  language?: 'english' | 'hindi' | 'hinglish';
}

export const Footer: React.FC<FooterProps> = ({ language = 'english' }) => {
  const translations = {
    english: {
      brand: 'VoiceCraft Market',
      tagline: 'Empowering artisans with AI-powered voice technology',
      quickLinks: 'Quick Links',
      home: 'Home',
      marketplace: 'Marketplace',
      becomeArtisan: 'Become an Artisan',
      howItWorks: 'How It Works',
      support: 'Support',
      helpCenter: 'Help Center',
      contact: 'Contact Us',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      connect: 'Connect With Us',
      madeWith: 'Made with',
      forArtisans: 'for artisans worldwide',
      copyright: '© 2025 VoiceCraft Market. All rights reserved.',
      address: 'Address',
      email: 'Email',
      phone: 'Phone'
    },
    hindi: {
      brand: 'वॉयसक्राफ्ट मार्केट',
      tagline: 'AI-संचालित वॉयस तकनीक के साथ कारीगरों को सशक्त बनाना',
      quickLinks: 'त्वरित लिंक',
      home: 'होम',
      marketplace: 'बाज़ार',
      becomeArtisan: 'कारीगर बनें',
      howItWorks: 'यह कैसे काम करता है',
      support: 'सहायता',
      helpCenter: 'सहायता केंद्र',
      contact: 'संपर्क करें',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      terms: 'सेवा की शर्तें',
      privacy: 'गोपनीयता नीति',
      connect: 'हमसे जुड़ें',
      madeWith: 'के साथ बनाया गया',
      forArtisans: 'दुनिया भर के कारीगरों के लिए',
      copyright: '© 2025 वॉयसक्राफ्ट मार्केट। सभी अधिकार सुरक्षित।',
      address: 'पता',
      email: 'ईमेल',
      phone: 'फोन'
    },
    hinglish: {
      brand: 'VoiceCraft Market',
      tagline: 'AI-powered voice technology se artisans ko empower kar rahe hain',
      quickLinks: 'Quick Links',
      home: 'Home',
      marketplace: 'Marketplace',
      becomeArtisan: 'Artisan Bano',
      howItWorks: 'Kaise Kaam Karta Hai',
      support: 'Support',
      helpCenter: 'Help Center',
      contact: 'Contact Karo',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      connect: 'Humse Judo',
      madeWith: 'Banaya gaya',
      forArtisans: 'duniya bhar ke artisans ke liye',
      copyright: '© 2025 VoiceCraft Market. Saare rights reserved hain.',
      address: 'Address',
      email: 'Email',
      phone: 'Phone'
    }
  };

  const t = translations[language];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mic className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{t.brand}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.tagline}
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>{t.madeWith}</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>{t.forArtisans}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.quickLinks}</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.home}
              </Link>
              <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.marketplace}
              </Link>
              <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.becomeArtisan}
              </Link>
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.howItWorks}
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.support}</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.helpCenter}
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.contact}
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.faq}
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.terms}
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.privacy}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.connect}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">{t.address}</div>
                  <div>Mumbai, India</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">{t.email}</div>
                  <div>support@voicecraft.market</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium">{t.phone}</div>
                  <div>+91 98765 43210</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            {t.copyright.replace('2025', currentYear.toString())}
          </div>
          <div className="flex items-center space-x-4">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Available in English, हिंदी, Hinglish
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
