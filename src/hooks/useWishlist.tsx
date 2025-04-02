
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

  // Check if wishlist table exists
  const checkWishlistTable = async (): Promise<boolean> => {
    try {
      // Try to query the system catalog to check if the table exists
      const { error } = await supabase
        .from('products') // Use a known table to avoid type errors
        .select('*')
        .limit(1)
        .abortSignal(new AbortController().signal);
      
      if (error) {
        console.error('Error checking for products table:', error);
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Error checking for table:', e);
      return false;
    }
  };

  // Load wishlist on mount and when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated && user) {
          // Check if we can access the database correctly first
          const canAccessDb = await checkWishlistTable();
          
          if (!canAccessDb) {
            console.log('Cannot access database properly, using localStorage');
            loadFromLocalStorage();
            return;
          }
          
          // For now, we'll store wishlist items in localStorage
          // In a production app, you would implement the wishlist table in Supabase
          loadFromLocalStorage();
        } else {
          // If not logged in, load wishlist from localStorage
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
          setWishlistItems(parsedWishlist);
        } catch (e) {
          console.error('Error parsing wishlist from localStorage:', e);
          setWishlistItems([]);
        }
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
          // For now, we'll store wishlist items in localStorage
          // In a production app, you would implement the wishlist table in Supabase
          localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
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
