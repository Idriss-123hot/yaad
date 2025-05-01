
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { ProductWithArtisan } from '@/models/types';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: ProductWithArtisan;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { wishlistItems, isLoading, addToWishlist, removeFromWishlist, refreshWishlist } = useWishlist();
  
  // Check if item is in wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      isLoading, 
      addToWishlist, 
      removeFromWishlist, 
      refreshWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
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
        .select(`
          *,
          product:products(
            *,
            artisan:artisans(*),
            category:categories(*),
            subcategory:subcategories(*)
          )
        `)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Map database column names to our camelCase format
      const formattedItems = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        createdAt: item.created_at,
        product: item.product ? {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description || '',
          price: item.product.price,
          discountPrice: item.product.discount_price,
          images: item.product.images || [],
          rating: item.product.rating || 0,
          reviewCount: item.product.review_count || 0,
          stock: item.product.stock,
          featured: item.product.featured || false,
          artisanId: item.product.artisan_id,
          category: item.product.category?.name,
          subcategory: item.product.subcategory?.name,
          mainCategory: item.product.category_id,
          material: item.product.material,
          origin: item.product.origin,
          tags: item.product.tags || [],
          createdAt: new Date(item.product.created_at),
          categoryId: item.product.category_id,
          subcategoryId: item.product.subcategory_id,
          artisan: item.product.artisan ? {
            id: item.product.artisan.id,
            name: item.product.artisan.name,
            description: item.product.artisan.description || '',
            profileImage: item.product.artisan.profile_photo,
            location: item.product.artisan.location || '',
            bio: item.product.artisan.bio || '',
            rating: item.product.artisan.rating || 0,
            reviewCount: item.product.artisan.review_count || 0,
            website: item.product.artisan.website || '',
            featured: item.product.artisan.featured || false,
            joinedDate: new Date(item.product.artisan.joined_date),
            galleryImages: item.product.artisan.first_gallery_images || [],
            productCount: 0
          } : undefined
        } : undefined
      })) as WishlistItem[];
      
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
