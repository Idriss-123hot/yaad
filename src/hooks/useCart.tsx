
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
          // Clean expired cart items first
          await supabase.rpc('clean_expired_cart_items');
          
          // Get cart items from Supabase (only non-expired items)
          const { data: cartData, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id)
            .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
          
          if (cartError) {
            console.error('Error loading cart from Supabase:', cartError);
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setCartItems(parsedCart);
            }
            setLoading(false);
            return;
          }
          
          // Get local cart for merging
          const localCart = localStorage.getItem('cart');
          let localItems: CartItem[] = [];
          
          if (localCart) {
            try {
              localItems = JSON.parse(localCart);
            } catch (e) {
              console.error('Error parsing local cart:', e);
            }
          }
          
          let hasExpiredItems = false;
          
          if (cartData) {
            // Check if we had local items that need to be merged
            if (localItems.length > 0) {
              // Merge local cart with database cart
              const mergedMap = new Map<string, CartItem>();
              
              // Add database items first
              cartData.forEach((item: any) => {
                const key = `${item.product_id}_${JSON.stringify(item.variations || {})}`;
                mergedMap.set(key, {
                  productId: item.product_id,
                  quantity: item.quantity,
                  variations: typeof item.variations === 'object' ? item.variations : {},
                });
              });
              
              // Merge with local items (sum quantities if product exists)
              localItems.forEach((localItem) => {
                const key = `${localItem.productId}_${JSON.stringify(localItem.variations || {})}`;
                const existing = mergedMap.get(key);
                if (existing) {
                  existing.quantity += localItem.quantity;
                } else {
                  mergedMap.set(key, localItem);
                }
              });
              
              // Save merged cart to database
              const itemsToUpsert = Array.from(mergedMap.values()).map(item => ({
                user_id: user.id,
                product_id: item.productId,
                quantity: item.quantity,
                variations: item.variations || {},
              }));
              
              if (itemsToUpsert.length > 0) {
                await supabase
                  .from('cart_items')
                  .upsert(itemsToUpsert, {
                    onConflict: 'user_id,product_id',
                  });
              }
              
              // Clear local cart after merge
              localStorage.removeItem('cart');
              
              toast({
                title: 'Panier synchronisé',
                description: 'Votre panier a été synchronisé avec succès',
              });
            }
            
            // Load product details for each cart item
            const itemsWithProducts: CartItem[] = await Promise.all(
              Array.from(cartData).map(async (item: any) => {
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
            
            // Show message if cart was expired
            if (hasExpiredItems) {
              toast({
                title: 'Panier expiré',
                description: 'Certains articles ont été retirés car votre panier a expiré après 24h d\'inactivité',
                variant: 'destructive',
              });
            }
          } else if (localItems.length > 0) {
            // No database cart but have local cart - save it
            const itemsToInsert = localItems.map(item => ({
              user_id: user.id,
              product_id: item.productId,
              quantity: item.quantity,
              variations: item.variations || {},
            }));
            
            await supabase
              .from('cart_items')
              .insert(itemsToInsert);
            
            localStorage.removeItem('cart');
            setCartItems(localItems);
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
  }, [user, isAuthenticated, toast]);
  
  // Save cart whenever it changes (optimized with upsert)
  useEffect(() => {
    const saveCart = async () => {
      if (loading) return;

      try {
        if (isAuthenticated && user?.id) {
          console.log('Saving cart to Supabase for user:', user.id);
          
          if (cartItems.length > 0) {
            // Use upsert for better performance
            const itemsToUpsert = cartItems.map(item => ({
              user_id: user.id,
              product_id: item.productId,
              quantity: item.quantity,
              variations: item.variations || {},
            }));

            console.log('Upserting cart items:', itemsToUpsert);

            const { error: upsertError } = await supabase
              .from('cart_items')
              .upsert(itemsToUpsert, {
                onConflict: 'user_id,product_id',
              });

            if (upsertError) {
              console.error('Error upserting cart items:', upsertError);
              localStorage.setItem('cart', JSON.stringify(cartItems));
              return;
            }

            console.log('Cart saved successfully to Supabase');
          } else {
            // If cart is empty, delete all items for this user
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user.id);
          }
        } else {
          // If not logged in, save cart to localStorage
          localStorage.setItem('cart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('Error saving cart:', error);
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    };

    saveCart();
  }, [cartItems, loading, user, isAuthenticated]);

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1, variations: Record<string, string> = {}) => {
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
      // Get product details
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
  const clearCart = async () => {
    setCartItems([]);
    
    // Also delete from database if user is authenticated
    if (isAuthenticated && user?.id) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
    
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
