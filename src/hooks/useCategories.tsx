
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to fetch categories');
        toast({
          title: 'Error',
          description: 'Failed to fetch categories',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);
  
  return { categories, loading, error };
}

export function useCategory(slug: string | undefined) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    async function fetchCategory() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        setCategory(data);
      } catch (err: any) {
        console.error('Error fetching category:', err);
        setError(err.message || 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategory();
  }, [slug]);
  
  return { category, loading, error };
}
