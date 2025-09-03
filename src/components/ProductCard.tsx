import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, Heart, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  title: string;
  price: string;
  artisan: string;
  image: string;
  voiceStory: string;
  language: 'english' | 'hindi' | 'hinglish';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  artisan,
  image,
  voiceStory,
  language
}) => {
  const translations = {
    english: {
      by: "by",
      hearStory: "Hear Story",
      addToCart: "Add to Cart"
    },
    hindi: {
      by: "द्वारा",
      hearStory: "कहानी सुनें",
      addToCart: "कार्ट में जोड़ें"
    },
    hinglish: {
      by: "by",
      hearStory: "Story suno",
      addToCart: "Cart mein add karo"
    }
  };

  const t = translations[language];

  return (
    <Card className="group hover:shadow-warm transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <Badge className="absolute top-4 left-4 bg-accent/90 text-accent-foreground">
          <Mic className="h-3 w-3 mr-1" />
          Voice Story
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h4 className="font-semibold line-clamp-2">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {t.by} {artisan}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{price}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-accent text-accent mr-1" />
            <span>4.9</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
          >
            <Mic className="h-3 w-3 mr-1" />
            {t.hearStory}
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            {t.addToCart}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};