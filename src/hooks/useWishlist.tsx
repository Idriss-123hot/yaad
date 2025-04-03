
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProductWithArtisan } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';

// Types
export interface WishlistItem {
  productId: string;
  addedAt: string;
  product?: ProductWithArtisan;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

// Create wishlist context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Wishlist provider component
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Load wishlist on mount and when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        if (isAuthenticated && user) {
          // Fetch wishlist items from Supabase for authenticated users
          // Using "any" temporarily to fix the TypeScript error with the table name
          const { data: wishlistData, error: wishlistError } = await supabase
            .from('wishlists' as any)
            .select('product_id, created_at')
            .eq('user_id', user.id);

          if (wishlistError) {
            console.error('Error fetching wishlist:', wishlistError);
            loadFromLocalStorage();
            return;
          }

          if (wishlistData) {
            const formattedItems = wishlistData.map(item => ({
              productId: item.product_id,
              addedAt: item.created_at
            }));
            
            // Fetch product details for each item
            await fetchProductDetails(formattedItems);
          }
        } else {
          // Use localStorage for non-authenticated users
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    const loadFromLocalStorage = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          
          // Fetch product details for each item
          fetchProductDetails(parsedWishlist);
        } catch (e) {
          console.error('Error parsing wishlist from localStorage:', e);
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    };
    
    // Helper function to fetch product details for wishlist items
    const fetchProductDetails = async (items: WishlistItem[]) => {
      if (items.length === 0) {
        setWishlistItems([]);
        return;
      }
      
      try {
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            try {
              const { data: productData, error: productError } = await supabase
                .from('products')
                .select(`
                  *,
                  product_variations(*),
                  artisan:artisans(*),
                  category:categories(*)
                `)
                .eq('id', item.productId)
                .maybeSingle();
              
              if (productError) {
                console.error('Error fetching product:', productError);
                return item;
              }
              
              return {
                ...item,
                product: productData ? mapDatabaseProductToProduct(productData) : undefined,
              };
            } catch (error) {
              console.error(`Error fetching product ${item.productId}:`, error);
              return item;
            }
          })
        );
        
        setWishlistItems(itemsWithProducts);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setWishlistItems(items);
      }
    };
    
    loadWishlist();
  }, [user, isAuthenticated]);
  
  // Save wishlist whenever it changes
  useEffect(() => {
    if (loading) return;
    
    // For non-authenticated users, save to localStorage
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, loading, isAuthenticated]);
  
  // Add item to wishlist
  const addToWishlist = async (productId: string) => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter des produits à votre liste de souhaits',
      });
      
      // Save intended action to localStorage
      localStorage.setItem('intended_action', JSON.stringify({
        type: 'add_to_wishlist',
        data: { productId }
      }));
      
      // Save item in localStorage wishlist for later
      const newItem: WishlistItem = {
        productId, 
        addedAt: new Date().toISOString(),
      };
      
      setWishlistItems(prevItems => {
        const updatedItems = [...prevItems, newItem];
        localStorage.setItem('wishlist', JSON.stringify(updatedItems));
        return updatedItems;
      });
      
      navigate('/auth');
      return;
    }
    
    // Check if item already exists in wishlist
    if (isInWishlist(productId)) {
      toast({
        title: 'Déjà dans votre liste',
        description: 'Ce produit est déjà dans votre liste de souhaits',
      });
      return;
    }
    
    // Add to database for authenticated users
    if (isAuthenticated && user) {
      try {
        // Using "any" temporarily to fix the TypeScript error with the table name
        const { error } = await supabase
          .from('wishlists' as any)
          .insert({
            user_id: user.id,
            product_id: productId
          });
          
        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            toast({
              title: 'Déjà dans votre liste',
              description: 'Ce produit est déjà dans votre liste de souhaits',
            });
            return;
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error adding to wishlist in database:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible d\'ajouter le produit à votre liste de souhaits',
          variant: 'destructive',
        });
        return;
      }
    }
    
    // Fetch product details
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_variations(*),
          artisan:artisans(*),
          category:categories(*)
        `)
        .eq('id', productId)
        .maybeSingle();
      
      if (productError) {
        console.error('Error fetching product:', productError);
        toast({
          title: 'Erreur',
          description: 'Impossible d\'ajouter le produit à votre liste de souhaits',
          variant: 'destructive',
        });
        return;
      }
      
      // Add new item with product details
      const newItem: WishlistItem = {
        productId, 
        addedAt: new Date().toISOString(),
        product: productData ? mapDatabaseProductToProduct(productData) : undefined,
      };
      
      setWishlistItems([...wishlistItems, newItem]);
      
      toast({
        title: 'Produit ajouté',
        description: 'Le produit a été ajouté à votre liste de souhaits',
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit à votre liste de souhaits',
        variant: 'destructive',
      });
    }
  };
  
  // Remove item from wishlist
  const removeFromWishlist = async (productId: string) => {
    // Remove from database for authenticated users
    if (isAuthenticated && user) {
      try {
        // Using "any" temporarily to fix the TypeScript error with the table name
        const { error } = await supabase
          .from('wishlists' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error removing from wishlist in database:', error);
      }
    }
    
    // Update local state
    setWishlistItems(
      wishlistItems.filter((item) => item.productId !== productId)
    );
    
    toast({
      title: 'Produit supprimé',
      description: 'Le produit a été retiré de votre liste de souhaits',
    });
  };
  
  // Clear wishlist
  const clearWishlist = async () => {
    // Clear from database for authenticated users
    if (isAuthenticated && user) {
      try {
        // Using "any" temporarily to fix the TypeScript error with the table name
        const { error } = await supabase
          .from('wishlists' as any)
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Error clearing wishlist in database:', error);
      }
    }
    
    // Update local state
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
    
    toast({
      title: 'Liste vidée',
      description: 'Votre liste de souhaits a été vidée',
    });
  };
  
  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };
  
  const value: WishlistContextType = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Wishlist context hook
export function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
}
