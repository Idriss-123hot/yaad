
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
      // Log initial pour ce useEffect
      console.log('useCart/saveCart EFFECT: Triggered. Loading:', loading, 'IsAuth:', isAuthenticated, 'User:', user?.id);

      if (loading) {
        console.log('useCart/saveCart EFFECT: Still loading, skipping save.');
        return;
      }

      try {
        if (isAuthenticated && user && user.id) { // Assurez-vous que user.id est présent
          console.log(`useCart/saveCart EFFECT: User ${user.id} is authenticated. Attempting to save to Supabase.`);
          console.log('useCart/saveCart EFFECT: Current cartItems state before Supabase ops:', JSON.stringify(cartItems, null, 2));


          // Check if cart_items table exists (votre logique existante)
          // Vous pouvez ajouter un log ici pour voir si tableError se produit
          const { error: tableError } = await supabase
            .from('cart_items')
            .select('id', { count: 'exact', head: true }) // Plus léger pour vérifier l'existence/RLS
            .eq('user_id', user.id) // Important pour que RLS s'applique correctement
            .abortSignal(new AbortController().signal);

          if (tableError) {
            console.warn('useCart/saveCart EFFECT: Error checking cart_items table (or RLS issue). Falling back to localStorage. Error:', JSON.stringify(tableError, null, 2));
            localStorage.setItem('cart', JSON.stringify(cartItems));
            return;
          }
          console.log('useCart/saveCart EFFECT: cart_items table check passed (or RLS allows select).');


          // 1. Supprimer les anciens articles du panier pour cet utilisateur
          console.log(`useCart/saveCart EFFECT: Attempting to delete old cart items for user_id: ${user.id}`);
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('useCart/saveCart EFFECT: Error deleting old cart items:', JSON.stringify(deleteError, null, 2));
            // Gérer l'erreur - votre code original ne la propageait pas, il continuait.
            // Pour le débogage, il peut être utile de la propager ou d'arrêter ici.
            // Alternativement, vous pouvez enregistrer dans localStorage comme fallback
            // throw deleteError; // Décommenter pour arrêter le flux ici en cas d'erreur de suppression
            console.warn('useCart/saveCart EFFECT: Fallback to localStorage due to delete error.');
            localStorage.setItem('cart', JSON.stringify(cartItems)); // Fallback comme dans votre catch original
            return; // Important de sortir si la suppression échoue et que vous ne voulez pas insérer
          }
          console.log(`useCart/saveCart EFFECT: Successfully deleted old cart items (or no items to delete) for user_id: ${user.id}`);

          // 2. Préparer et insérer les nouveaux articles (uniquement si cartItems n'est pas vide)
          if (cartItems.length > 0) {
            const payloadToInsert = cartItems.map(item => ({
              user_id: user.id, // ESSENTIEL pour RLS
              product_id: item.productId, // Assurez-vous que c'est le nom correct de la colonne
              quantity: item.quantity,
              variations: item.variations || {}, // Assurez-vous que la structure correspond à votre colonne JSONB
                                                 // Si variations peut être null dans la DB, utilisez item.variations || null
            }));

            console.log('useCart/saveCart EFFECT: Payload to be inserted:', JSON.stringify(payloadToInsert, null, 2));

            // Vérification supplémentaire (paranoïa)
            payloadToInsert.forEach(item => {
              if (!item.user_id) {
                console.error("CRITICAL in useCart/saveCart EFFECT: user_id is MISSING from an item in the payload before insert!", item);
              }
              if (!item.product_id) {
                console.error("CRITICAL in useCart/saveCart EFFECT: product_id is MISSING from an item in the payload before insert!", item);
              }
            });

            console.log('useCart/saveCart EFFECT: Attempting to insert new cart items...');
            const { data: insertedData, error: insertError } = await supabase
              .from('cart_items')
              .insert(payloadToInsert)
              .select(); // <--- MODIFICATION CRUCIALE ICI: AJOUT DE .select()

            if (insertError) {
              console.error('useCart/saveCart EFFECT: Error inserting new cart items:', JSON.stringify(insertError, null, 2));
              // Si l'erreur est due à RLS (par exemple, la condition WITH CHECK échoue), elle apparaîtra ici.
              // throw insertError; // Décommenter pour arrêter le flux, sera attrapé par le catch externe
              // Le throw est géré par le bloc catch externe de toute façon
               throw insertError; // Laissez-le être attrapé par le bloc catch plus bas
            }

            console.log('useCart/saveCart EFFECT: Insert operation completed by Supabase.');
            console.log('useCart/saveCart EFFECT: Data returned by Supabase after insert (insertedData):', JSON.stringify(insertedData, null, 2));

            if (!insertedData || insertedData.length === 0) {
              console.warn('useCart/saveCart EFFECT: insertedData from Supabase is null or empty. This strongly suggests RLS policy (WITH CHECK) prevented the insertion, or a database constraint (trigger, etc.) silently prevented it, or data was invalid.');
            } else {
              console.log('useCart/saveCart EFFECT: Successfully inserted new cart items. Count:', insertedData.length);
            }
          } else {
            console.log('useCart/saveCart EFFECT: cartItems is empty, nothing to insert. Cart in DB is now empty (after delete).');
          }
        } else {
          // If not logged in, save cart to localStorage (votre logique existante)
          console.log('useCart/saveCart EFFECT: User not authenticated or user object missing. Saving to localStorage.');
          localStorage.setItem('cart', JSON.stringify(cartItems));
        }
      } catch (error) {
        console.error('useCart/saveCart EFFECT: CATCH BLOCK - Error saving cart:', error);
        if (error && typeof error === 'object' && 'message' in error) {
            console.error('useCart/saveCart EFFECT: Error message:', (error as any).message);
            console.error('useCart/saveCart EFFECT: Error details:', JSON.stringify(error, null, 2));
          }
        // Fallback to localStorage (votre logique existante)
        console.warn('useCart/saveCart EFFECT: Fallback to localStorage due to CATCH block.');
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    };

    saveCart(); // Appel de la fonction saveCart définie ci-dessus
  }, [cartItems, loading, user, isAuthenticated, toast, navigate]); // Ajoutez toast et navigate si utilisés dans l'effet
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
