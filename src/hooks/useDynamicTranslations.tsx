import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ArtisanTranslation {
  name?: string;
  bio?: string;
  description?: string;
}

export interface ProductTranslation {
  title?: string;
  description?: string;
  material?: string;
  origin?: string;
}

/**
 * Hook for managing artisan translations
 */
export function useArtisanTranslations(artisanId: string) {
  const { currentLanguage } = useLanguage();
  const [translations, setTranslations] = useState<ArtisanTranslation>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslations = useCallback(async () => {
    if (!artisanId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_artisan_translation', {
        artisan_uuid: artisanId,
        locale_param: currentLanguage
      });

      if (error) throw error;
      
      setTranslations((data as ArtisanTranslation) || {});
    } catch (err: any) {
      console.error('Error fetching artisan translations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [artisanId, currentLanguage]);

  const saveTranslation = useCallback(async (field: keyof ArtisanTranslation, value: string, locale?: string) => {
    if (!artisanId) return;
    
    try {
      const targetLocale = locale || currentLanguage;
      
      const { error } = await supabase
        .from('artisan_translations')
        .upsert({
          artisan_id: artisanId,
          locale: targetLocale,
          [field]: value
        });

      if (error) throw error;
      
      // Refresh translations if updating current language
      if (targetLocale === currentLanguage) {
        await fetchTranslations();
      }
    } catch (err: any) {
      console.error('Error saving artisan translation:', err);
      throw err;
    }
  }, [artisanId, currentLanguage, fetchTranslations]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  return {
    translations,
    loading,
    error,
    saveTranslation,
    refetch: fetchTranslations
  };
}

/**
 * Hook for managing product translations
 */
export function useProductTranslations(productId: string) {
  const { currentLanguage } = useLanguage();
  const [translations, setTranslations] = useState<ProductTranslation>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslations = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_product_translation', {
        product_uuid: productId,
        locale_param: currentLanguage
      });

      if (error) throw error;
      
      setTranslations((data as ProductTranslation) || {});
    } catch (err: any) {
      console.error('Error fetching product translations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId, currentLanguage]);

  const saveTranslation = useCallback(async (field: keyof ProductTranslation, value: string, locale?: string) => {
    if (!productId) return;
    
    try {
      const targetLocale = locale || currentLanguage;
      
      const { error } = await supabase
        .from('product_translations')
        .upsert({
          product_id: productId,
          locale: targetLocale,
          [field]: value
        });

      if (error) throw error;
      
      // Refresh translations if updating current language
      if (targetLocale === currentLanguage) {
        await fetchTranslations();
      }
    } catch (err: any) {
      console.error('Error saving product translation:', err);
      throw err;
    }
  }, [productId, currentLanguage, fetchTranslations]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  return {
    translations,
    loading,
    error,
    saveTranslation,
    refetch: fetchTranslations
  };
}