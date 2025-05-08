
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Type definition for translations
export interface Translations {
  [key: string]: string;
}

// Default translations in case the API call fails
const DEFAULT_TRANSLATIONS: { [key: string]: Translations } = {
  fr: {
    view_all_products: 'Voir tous les produits',
    featured_collection: 'Collection à la une',
    // Essential fallbacks for critical UI elements
  },
  en: {
    view_all_products: 'View all products',
    featured_collection: 'Featured collection',
    // Essential fallbacks for critical UI elements
  },
  ar: {
    view_all_products: 'عرض جميع المنتجات',
    featured_collection: 'المجموعة المميزة',
    // Essential fallbacks for critical UI elements
  },
  'ar-MA': {
    view_all_products: 'شوف گاع المنتوجات',
    featured_collection: 'المجموعة الخاصة',
    // Essential fallbacks for critical UI elements
  }
};

/**
 * Custom hook to fetch translations based on the current locale
 * @returns Object with translations and loading state
 */
export function useTranslations() {
  // Get the current language from our context
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage;
  
  const [translations, setTranslations] = useState<Translations>(DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS.fr);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Cache management
  const cacheTTL = 5 * 60 * 1000; // 5 minutes cache expiry
  
  // Function to check if cache is valid
  const isCacheValid = useCallback(() => {
    const cachedData = localStorage.getItem(`translations_cache_${locale}`);
    if (!cachedData) return false;
    
    try {
      const { timestamp, data } = JSON.parse(cachedData);
      return Date.now() - timestamp < cacheTTL && Object.keys(data).length > 0;
    } catch (e) {
      console.error('Cache validation error:', e);
      return false;
    }
  }, [locale, cacheTTL]);

  // Function to get cached translations
  const getCachedTranslations = useCallback(() => {
    try {
      const cachedData = localStorage.getItem(`translations_cache_${locale}`);
      if (!cachedData) return null;
      
      const { data } = JSON.parse(cachedData);
      return data;
    } catch (e) {
      console.error('Cache retrieval error:', e);
      return null;
    }
  }, [locale]);

  // Function to save translations to cache
  const cacheTranslations = useCallback((data: Translations) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(`translations_cache_${locale}`, JSON.stringify(cacheData));
    } catch (e) {
      console.error('Cache saving error:', e);
    }
  }, [locale]);

  useEffect(() => {
    console.log(`useTranslations: Language changed to ${locale}, fetching translations...`);
    
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Try to use cached translations first
        if (isCacheValid()) {
          const cachedTranslations = getCachedTranslations();
          if (cachedTranslations) {
            console.log(`Using cached translations for ${locale}`);
            setTranslations(cachedTranslations);
            setIsLoading(false);
            return;
          }
        }
        
        // Use a direct RPC call to get translations
        const { data, error } = await supabase.rpc('get_translations', { locale });
        
        if (error) {
          console.error('Error fetching translations:', error);
          // Fall back to default translations for the current locale
          setTranslations(DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS.fr);
          return;
        }
        
        if (data && Object.keys(data).length > 0) {
          // Convert data to Translations type
          console.log(`Retrieved ${Object.keys(data).length} translations for ${locale}`);
          setTranslations(data as Translations);
          
          // Cache the translations
          cacheTranslations(data as Translations);
        } else {
          // Fall back to default translations if no data
          console.log(`No translations found for ${locale}, using defaults`);
          setTranslations(DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS.fr);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fall back to default translations
        setTranslations(DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS.fr);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
    // Force refresh translations every cacheTTL
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
    }, cacheTTL);

    return () => clearInterval(interval);
  }, [locale, lastUpdated, isCacheValid, getCachedTranslations, cacheTranslations, cacheTTL]); 

  /**
   * Translate a key
   * @param key Translation key
   * @param fallback Fallback text if key is not found
   * @returns Translated text
   */
  const t = useCallback((key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  }, [translations]);

  return { t, isLoading, locale };
}
