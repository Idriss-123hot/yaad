
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { currentLanguage, isRTL } = useLanguage();
  
  // Update the document's dir attribute and CSS classes based on language
  useEffect(() => {
    // Apply RTL direction to the HTML document for proper text rendering
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add a class for text-specific RTL styling
    if (isRTL) {
      document.body.classList.add('rtl-text');
    } else {
      document.body.classList.remove('rtl-text');
    }
    
    // Log language change for debugging
    console.log(`RTLProvider: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
    
    // Cleanup function
    return () => {
      document.body.classList.remove('rtl-text');
    };
  }, [currentLanguage, isRTL]);
  
  return <>{children}</>;
}

export default RTLProvider;
