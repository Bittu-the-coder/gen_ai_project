import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart } from 'lucide-react';

interface ArtisanCardProps {
  name: string;
  craft: string;
  location: string;
  image: string;
  story: string;
  language: 'english' | 'hindi' | 'hinglish';
}

export const ArtisanCard: React.FC<ArtisanCardProps> = ({
  name,
  craft,
  location,
  image,
  story,
  language
}) => {
  const translations = {
    english: {
      viewProfile: "View Profile",
      products: "Products",
      followers: "Followers"
    },
    hindi: {
      viewProfile: "प्रोफ़ाइल देखें",
      products: "उत्पाद",
      followers: "फॉलोअर्स"
    },
    hinglish: {
      viewProfile: "Profile dekho",
      products: "Products",
      followers: "Followers"
    }
  };

  const t = translations[language];

  return (
    <Card className="group hover:shadow-warm transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={image} 
          alt={`${name} - ${craft} artisan`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <Badge className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground">
          {craft}
        </Badge>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">{name}</h4>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {story}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>24 {t.products}</span>
            <span>1.2k {t.followers}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-accent text-accent mr-1" />
              <span>4.8</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
        >
          {t.viewProfile}
        </Button>
      </CardContent>
    </Card>
  );
};