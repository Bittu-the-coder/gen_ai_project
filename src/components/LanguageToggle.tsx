import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageToggleProps {
  language: 'english' | 'hindi' | 'hinglish';
  onLanguageChange: (language: 'english' | 'hindi' | 'hinglish') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onLanguageChange,
}) => {
  const languages = {
    english: { name: 'English', code: 'EN' },
    hindi: { name: 'हिंदी', code: 'HI' },
    hinglish: { name: 'Hinglish', code: 'HIN' },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{languages[language].name}</span>
          <span className="sm:hidden">{languages[language].code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([key, lang]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onLanguageChange(key as 'english' | 'hindi' | 'hinglish')}
            className={language === key ? 'bg-primary/10 text-primary' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};