
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the supported languages
export type Language = 'fr' | 'en' | 'ar' | 'ar-MA';

// Define the context interface
interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'fr',
  changeLanguage: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize language from localStorage or use default
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('yaad-language');
    return (savedLanguage as Language) || 'fr';
  });

  // Effect to update localStorage when language changes
  useEffect(() => {
    console.log(`LanguageProvider: Language changed to ${currentLanguage}`);
    localStorage.setItem('yaad-language', currentLanguage);
  }, [currentLanguage]);

  // Function to change the current language
  const changeLanguage = (language: Language) => {
    console.log(`Changing language to: ${language}`);
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
