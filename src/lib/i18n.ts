
import { useState, useEffect } from 'react';
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
    browse_by_category: 'Rechercher par catégories',
    explore_collection: 'Explorer la collection',
    our_artisans: 'Nos Artisans',
    discover_artisans: 'Découvrez les talentueux artisans derrière nos créations uniques',
    all_artisans: 'Tous nos artisans',
    authentic_crafts: 'Artisanat Authentique',
    discover_collection: 'Découvrez notre collection exclusive d\'artisanat marocain',
    berber_carpets: 'Tapis Berbères',
    traditional_patterns: 'Des motifs traditionnels tissés à la main par nos artisans',
    moroccan_craftsmanship: 'Savoir-Faire Marocain',
    meet_artisans: 'Rencontrez nos artisans passionnés et leur expertise',
    explore: 'Explorer',
    discover: 'Découvrir',
    meet: 'Rencontrer',
    previous: 'Précédent',
    next: 'Suivant',
    go_to_slide: 'Aller à la diapositive',
  },
  en: {
    view_all_products: 'View all products',
    featured_collection: 'Featured collection',
    browse_by_category: 'Browse by category',
    explore_collection: 'Explore collection',
    our_artisans: 'Our Artisans',
    discover_artisans: 'Discover the talented artisans behind our unique creations',
    all_artisans: 'All artisans',
    authentic_crafts: 'Authentic Crafts',
    discover_collection: 'Discover our exclusive collection of Moroccan craftsmanship',
    berber_carpets: 'Berber Carpets',
    traditional_patterns: 'Traditional patterns hand-woven by our artisans',
    moroccan_craftsmanship: 'Moroccan Craftsmanship',
    meet_artisans: 'Meet our passionate artisans and their expertise',
    explore: 'Explore',
    discover: 'Discover',
    meet: 'Meet',
    previous: 'Previous',
    next: 'Next',
    go_to_slide: 'Go to slide',
  },
  ar: {
    view_all_products: 'عرض جميع المنتجات',
    featured_collection: 'المجموعة المميزة',
    browse_by_category: 'تصفح حسب الفئة',
    explore_collection: 'استكشاف المجموعة',
  },
  'ar-MA': {
    view_all_products: 'شوف گاع المنتوجات',
    featured_collection: 'المجموعة الخاصة',
    browse_by_category: 'تصفح عبر الفئات',
    explore_collection: 'اكتشف المجموعة',
  },
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

  useEffect(() => {
    console.log(`useTranslations: Language changed to ${locale}`);
    
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Use a direct RPC call with proper typing
        const { data, error } = await supabase.rpc('get_translations', { locale });
        
        if (error) {
          console.error('Error fetching translations:', error);
          // Fall back to default translations for the current locale
          setTranslations(DEFAULT_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS.fr);
          return;
        }
        
        if (data && Object.keys(data).length > 0) {
          // Convert data to Translations type
          console.log(`Retrieved translations for ${locale}:`, data);
          setTranslations(data as Translations);
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
  }, [locale]); // Re-fetch when locale changes

  /**
   * Translate a key
   * @param key Translation key
   * @param fallback Fallback text if key is not found
   * @returns Translated text
   */
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return { t, isLoading, locale };
}
