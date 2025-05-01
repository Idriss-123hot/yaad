
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch wishlist items on mount and when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch all wishlist items for the current user
  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Map database column names to our camelCase format
      const formattedItems: WishlistItem[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        createdAt: item.created_at
      }));
      
      setWishlistItems(formattedItems);
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a product to the wishlist
  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add products to your wishlist"
      });
      return Promise.reject(new Error('Authentication required'));
    }
    
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([
          { user_id: user!.id, product_id: productId }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const newItem: WishlistItem = {
          id: data[0].id,
          userId: data[0].user_id,
          productId: data[0].product_id,
          createdAt: data[0].created_at
        };
        
        setWishlistItems([...wishlistItems, newItem]);
      }
      
      return data;
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      toast({
        title: "Error adding to wishlist",
        description: err.message,
        variant: "destructive"
      });
      return Promise.reject(err);
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return Promise.reject(new Error('Authentication required'));
    
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: user!.id, product_id: productId });
        
      if (error) throw error;
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
      
      return true;
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      toast({
        title: "Error removing from wishlist",
        description: err.message,
        variant: "destructive"
      });
      return Promise.reject(err);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlistItems
  };
}
