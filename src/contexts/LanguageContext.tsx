
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
    localStorage.setItem('yaad-language', currentLanguage);
    // You might want to add additional code here to refresh content
    // when language changes, depending on your implementation
  }, [currentLanguage]);

  // Function to change the current language
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
