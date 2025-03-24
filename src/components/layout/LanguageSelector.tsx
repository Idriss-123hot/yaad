
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

type Language = 'en' | 'fr';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    
    // Here you would integrate with your i18n solution
    // For this example we're just showing the UI component
    
    // Example of how you might set a language in localStorage:
    localStorage.setItem('yaad-language', language);
    
    // In a real app, you would trigger your i18n library here
    // i18n.changeLanguage(language);
    
    // For a full implementation, you might need to reload the page
    // or update all the translated content
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')} 
          className={currentLanguage === 'fr' ? 'bg-terracotta-50 text-terracotta-600' : ''}
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLanguage === 'en' ? 'bg-terracotta-50 text-terracotta-600' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
