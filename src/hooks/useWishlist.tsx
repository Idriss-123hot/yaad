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

  // Load wishlist from localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        try {
          const parsedWishlist = JSON.parse(localWishlist);
          setWishlistItems(parsedWishlist);
        } catch (error) {
          console.error('Error parsing local wishlist:', error);
          localStorage.removeItem('wishlist');
        }
      }
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch and merge wishlist items when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAndMergeWishlist();
    }
  }, [isAuthenticated, user]);

  // Fetch and merge wishlist items from database and localStorage
  const fetchAndMergeWishlist = async () => {
    try {
      setIsLoading(true);
      
      // Get local wishlist
      const localWishlist = localStorage.getItem('wishlist');
      const localProductIds: string[] = localWishlist 
        ? JSON.parse(localWishlist).map((item: WishlistItem) => item.productId)
        : [];
      
      // Fetch database wishlist
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
      
      // Merge local wishlist items into database if any
      if (localProductIds.length > 0) {
        const dbProductIds = formattedItems.map(item => item.productId);
        const newProductIds = localProductIds.filter(id => !dbProductIds.includes(id));
        
        if (newProductIds.length > 0) {
          // Insert local items into database
          const itemsToInsert = newProductIds.map(productId => ({
            user_id: user!.id,
            product_id: productId
          }));
          
          const { error: insertError } = await supabase
            .from('wishlists')
            .insert(itemsToInsert);
          
          if (insertError) {
            console.error('Error merging local wishlist:', insertError);
          } else {
            toast({
              title: "Favoris synchronisés",
              description: `${newProductIds.length} produit(s) de votre liste locale ont été ajoutés à vos favoris.`
            });
            
            // Refresh the wishlist to include the newly added items
            await fetchAndMergeWishlist();
          }
        }
        
        // Clear local storage after merge
        localStorage.removeItem('wishlist');
      }
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch wishlist items for authenticated users
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
      // Store in localStorage for non-authenticated users
      const localWishlist = localStorage.getItem('wishlist');
      const currentWishlist: WishlistItem[] = localWishlist ? JSON.parse(localWishlist) : [];
      
      // Check if product already exists
      if (currentWishlist.some(item => item.productId === productId)) {
        toast({
          title: "Déjà dans les favoris",
          description: "Ce produit est déjà dans vos favoris"
        });
        return Promise.resolve(null);
      }
      
      const newItem: WishlistItem = {
        id: crypto.randomUUID(),
        userId: '',
        productId,
        createdAt: new Date().toISOString()
      };
      
      currentWishlist.push(newItem);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      setWishlistItems(currentWishlist);
      
      toast({
        title: "Ajouté aux favoris",
        description: "Connectez-vous pour synchroniser vos favoris"
      });
      
      return Promise.resolve(newItem);
    }
    
    try {
      // Use insert with on conflict do nothing to avoid duplicates
      const { data, error } = await supabase
        .from('wishlists')
        .insert([
          { user_id: user!.id, product_id: productId }
        ])
        .select();
        
      if (error) {
        // If duplicate, just notify user
        if (error.code === '23505') {
          toast({
            title: "Déjà dans les favoris",
            description: "Ce produit est déjà dans vos favoris"
          });
          return Promise.resolve(null);
        }
        throw error;
      }
      
      if (data && data[0]) {
        const newItem: WishlistItem = {
          id: data[0].id,
          userId: data[0].user_id,
          productId: data[0].product_id,
          createdAt: data[0].created_at
        };
        
        setWishlistItems([...wishlistItems, newItem]);
        
        toast({
          title: "Ajouté aux favoris",
          description: "Le produit a été ajouté à vos favoris"
        });
      }
      
      return data;
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit aux favoris",
        variant: "destructive"
      });
      return Promise.reject(err);
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      // Remove from localStorage for non-authenticated users
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        const currentWishlist: WishlistItem[] = JSON.parse(localWishlist);
        const updatedWishlist = currentWishlist.filter(item => item.productId !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlistItems(updatedWishlist);
        
        toast({
          title: "Retiré des favoris",
          description: "Le produit a été retiré de vos favoris"
        });
      }
      return Promise.resolve(true);
    }
    
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .match({ user_id: user!.id, product_id: productId });
        
      if (error) throw error;
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
      
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris"
      });
      
      return true;
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit des favoris",
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
