
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { currentLanguage } = useLanguage();
  
  // Update the document's dir attribute based on language
  useEffect(() => {
    const isRTL = currentLanguage === 'ar' || currentLanguage === 'ar-MA';
    
    // Only update the document direction attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add a class for text-specific RTL styling but not layout changes
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
  }, [currentLanguage]);
  
  return <>{children}</>;
}

export default RTLProvider;
