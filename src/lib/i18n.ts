
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type definition for translations
export interface Translations {
  [key: string]: string;
}

// Default translations in case the API call fails
const DEFAULT_TRANSLATIONS: Translations = {
  view_all_products: 'Voir tous les produits',
  featured_collection: 'Collection à la une',
  browse_by_category: 'Rechercher par catégories',
  explore_collection: 'Explorer la collection',
};

/**
 * Custom hook to fetch translations based on the current locale
 * @param locale The current locale (default: 'fr')
 * @returns Object with translations and loading state
 */
export function useTranslations(locale: 'fr' | 'en' = 'fr') {
  const [translations, setTranslations] = useState<Translations>(DEFAULT_TRANSLATIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Fetch translations from Supabase using the function directly
        const { data, error } = await supabase.rpc('get_translations' as any, { locale });
        
        if (error) {
          console.error('Error fetching translations:', error);
          return;
        }
        
        if (data) {
          // Convert data to Translations type
          const translationsData: Translations = data as Translations;
          setTranslations(translationsData);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [locale]);

  /**
   * Translate a key
   * @param key Translation key
   * @param fallback Fallback text if key is not found
   * @returns Translated text
   */
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return { t, isLoading };
}
