
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProductWithArtisan } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';

// Types
export interface CartItem {
  productId: string;
  quantity: number;
  product?: ProductWithArtisan;
  variations?: Record<string, string>;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number, variations?: Record<string, string>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variations?: Record<string, string>) => void;
  removeFromCart: (productId: string, variations?: Record<string, string>) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Create cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Load cart on mount and when user changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      try {
        if (isAuthenticated && user) {
          // Check if cart_items table exists
          const { error: tableError } = await supabase
            .from('cart_items')
            .select('*')
            .limit(1)
            .abortSignal(new AbortController().signal);
            
          if (tableError) {
            console.log('Cart items table does not exist yet, using localStorage');
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
              } catch (e) {
                console.error('Error parsing cart from localStorage:', e);
              }
            }
            setLoading(false);
            return;
          }
          
          // If logged in, get cart items from Supabase
          const { data: cartData, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (cartError) {
            throw cartError;
          }
          
          if (cartData) {
            // Load product details for each cart item
            const itemsWithProducts: CartItem[] = await Promise.all(
              cartData.map(async (item: any) => {
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
                    quantity: item.quantity,
                    variations: typeof item.variations === 'object' ? item.variations : {},
                  };
                }
                
                return {
                  productId: item.product_id,
                  quantity: item.quantity,
                  variations: typeof item.variations === 'object' ? item.variations : {},
                  product: productData ? mapDatabaseProductToProduct(productData) : undefined,
                };
              })
            );
            
            setCartItems(itemsWithProducts);
          }
        } else {
          // If not logged in, load cart from localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              setCartItems(parsedCart);
            } catch (e) {
              console.error('Error parsing cart from localStorage:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [user, isAuthenticated]);
  
  // Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (loading) return;
      
      try {
        if (isAuthenticated && user) {
          // Check if cart_items table exists
          const { error: tableError } = await supabase
            .from('cart_items')
            .select('*')
            .limit(1)
            .abortSignal(new AbortController().signal);
            
          if (tableError) {
            console.log('Cart items table does not exist yet, saving to localStorage');
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return;
          }
          
          // If logged in, save cart to Supabase
          // First clear the existing cart
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);
          
          // Then insert new items
          if (cartItems.length > 0) {
            const { error } = await supabase
              .from('cart_items')
              .insert(
                cartItems.map(item => ({
                  user_id: user.id,
                  product_id: item.productId,
                  quantity: item.quantity,
                  variations: item.variations || {},
                }))
              );
            
            if (error) throw error;
          }
        } else {
          // If not logged in, save cart to localStorage
          localStorage.setItem('cart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Error saving cart:', error);
        
        // Fallback to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    };
    
    saveCart();
  }, [cartItems, loading, user, isAuthenticated]);
  
  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1, variations: Record<string, string> = {}) => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter des produits au panier',
      });
      
      // Save intended action to localStorage
      localStorage.setItem('intended_action', JSON.stringify({
        type: 'add_to_cart',
        data: { productId, quantity, variations }
      }));
      
      navigate('/auth');
      return;
    }
    
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId && 
      JSON.stringify(item.variations) === JSON.stringify(variations)
    );
    
    if (existingItemIndex >= 0) {
      // If item already exists, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
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
          description: 'Impossible d\'ajouter le produit au panier',
          variant: 'destructive',
        });
        return;
      }
      
      // Add new item with product details
      setCartItems([
        ...cartItems,
        { 
          productId, 
          quantity, 
          variations,
          product: productData ? mapDatabaseProductToProduct(productData) : undefined,
        },
      ]);
    }
    
    toast({
      title: 'Produit ajouté',
      description: 'Le produit a été ajouté à votre panier',
    });
  };
  
  // Update item quantity
  const updateQuantity = (productId: string, quantity: number, variations: Record<string, string> = {}) => {
    if (quantity <= 0) {
      // If quantity is zero or negative, remove item
      removeFromCart(productId, variations);
      return;
    }
    
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId && 
      JSON.stringify(item.variations) === JSON.stringify(variations)
    );
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity = quantity;
      setCartItems(updatedItems);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string, variations: Record<string, string> = {}) => {
    setCartItems(
      cartItems.filter(
        (item) => !(item.productId === productId && 
          JSON.stringify(item.variations) === JSON.stringify(variations))
      )
    );
    
    toast({
      title: 'Produit supprimé',
      description: 'Le produit a été retiré de votre panier',
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: 'Panier vidé',
      description: 'Votre panier a été vidé',
    });
  };
  
  // Calculate cart totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product) return total;
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  const value: CartContextType = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Cart context hook
export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}
