
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
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add a class to the body for RTL-specific styling if needed
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('rtl');
    };
  }, [currentLanguage]);
  
  return <>{children}</>;
}

export default RTLProvider;
