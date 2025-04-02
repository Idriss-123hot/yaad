
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
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
          // If logged in, get wishlist items from Supabase
          // First check if the wishlist table exists
          const { error: tableError } = await supabase
            .from('wishlist')
            .select('*')
            .limit(1)
            .abortSignal(new AbortController().signal); // Use this instead of catch
            
          if (tableError) {
            console.log('Wishlist table does not exist yet, using localStorage');
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
              try {
                const parsedWishlist = JSON.parse(savedWishlist);
                setWishlistItems(parsedWishlist);
              } catch (e) {
                console.error('Error parsing wishlist from localStorage:', e);
              }
            }
            setLoading(false);
            return;
          }
          
          const { data, error } = await supabase
            .from('wishlist')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            // Load product details for each wishlist item
            const itemsWithProducts: WishlistItem[] = await Promise.all(
              data.map(async (item: any) => {
                const { data: productData, error: productError } = await supabase
                  .from('products')
                  .select(`
                    *,
                    product_variations(*),
                    artisan:artisans(*),
                    category:categories(*)
                  `)
                  .eq('id', item.product_id)
                  .single();
                
                if (productError) {
                  console.error('Error fetching product:', productError);
                  return {
                    productId: item.product_id,
                    addedAt: item.created_at,
                  };
                }
                
                return {
                  productId: item.product_id,
                  addedAt: item.created_at,
                  product: productData ? mapDatabaseProductToProduct(productData) : undefined,
                };
              })
            );
            
            setWishlistItems(itemsWithProducts);
          }
        } else {
          // If not logged in, load wishlist from localStorage
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            try {
              const parsedWishlist = JSON.parse(savedWishlist);
              setWishlistItems(parsedWishlist);
            } catch (e) {
              console.error('Error parsing wishlist from localStorage:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, [user, isAuthenticated]);
  
  // Save wishlist whenever it changes
  useEffect(() => {
    const saveWishlist = async () => {
      if (loading) return;
      
      try {
        if (isAuthenticated && user) {
          // Check if wishlist table exists before attempting to save
          const { error: tableError } = await supabase
            .from('wishlist')
            .select('*')
            .limit(1)
            .abortSignal(new AbortController().signal);
            
          if (tableError) {
            console.log('Wishlist table does not exist yet, saving to localStorage');
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
            return;
          }
          
          // If logged in, save wishlist to Supabase
          // First clear the existing wishlist
          await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', user.id);
          
          // Then insert new items
          if (wishlistItems.length > 0) {
            const { error } = await supabase
              .from('wishlist')
              .insert(
                wishlistItems.map(item => ({
                  user_id: user.id,
                  product_id: item.productId,
                }))
              );
            
            if (error) throw error;
          }
        } else {
          // If not logged in, save wishlist to localStorage
          localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
      } catch (error) {
        console.error('Error saving wishlist:', error);
        
        // Fallback to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      }
    };
    
    saveWishlist();
  }, [wishlistItems, loading, user, isAuthenticated]);
  
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
    
    // Fetch product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        product_variations(*),
        artisan:artisans(*),
        category:categories(*)
      `)
      .eq('id', productId)
      .single();
    
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
    setWishlistItems([
      ...wishlistItems,
      { 
        productId, 
        addedAt: new Date().toISOString(),
        product: productData ? mapDatabaseProductToProduct(productData) : undefined,
      },
    ]);
    
    toast({
      title: 'Produit ajouté',
      description: 'Le produit a été ajouté à votre liste de souhaits',
    });
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(
      wishlistItems.filter((item) => item.productId !== productId)
    );
    
    toast({
      title: 'Produit supprimé',
      description: 'Le produit a été retiré de votre liste de souhaits',
    });
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
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
