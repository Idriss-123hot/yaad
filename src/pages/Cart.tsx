import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';
import { Product } from '@/models/types';
import { Json } from '@/integrations/supabase/types';

// Define cart item type
interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
  variations?: Record<string, string>;
}

// Type for cart item from database
interface DatabaseCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  variations?: Json;
  created_at: string;
  updated_at: string;
}

// Create a hook for cart management
const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  // Load cart on mount and when session changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      try {
        if (session) {
          // If logged in, get cart items from Supabase
          const { data: cartData, error: cartError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (cartError) {
            throw cartError;
          }
          
          if (cartData) {
            // Load product details for each cart item
            const itemsWithProducts = await Promise.all(
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
            const parsedCart = JSON.parse(savedCart);
            
            // Load product details for each cart item
            const itemsWithProducts = await Promise.all(
              parsedCart.map(async (item: CartItem) => {
                const { data: productData, error: productError } = await supabase
                  .from('products')
                  .select(`
                    *,
                    product_variations(*),
                    artisan:artisans(*),
                    category:categories(*)
                  `)
                  .eq('id', item.productId)
                  .single();
                
                if (productError) {
                  console.error('Error fetching product:', productError);
                  return item;
                }
                
                return {
                  ...item,
                  product: productData ? mapDatabaseProductToProduct(productData) : undefined,
                };
              })
            );
            
            setCartItems(itemsWithProducts);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // If there's an error with the Supabase cart, try to load from localStorage as a fallback
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            
            // Load product details for each cart item
            const itemsWithProducts = await Promise.all(
              parsedCart.map(async (item: CartItem) => {
                const { data: productData, error: productError } = await supabase
                  .from('products')
                  .select(`
                    *,
                    product_variations(*),
                    artisan:artisans(*),
                    category:categories(*)
                  `)
                  .eq('id', item.productId)
                  .single();
                
                if (productError) {
                  console.error('Error fetching product:', productError);
                  return item;
                }
                
                return {
                  ...item,
                  product: productData ? mapDatabaseProductToProduct(productData) : undefined,
                };
              })
            );
            
            setCartItems(itemsWithProducts);
          } catch (e) {
            toast({
              title: 'Erreur',
              description: 'Impossible de charger votre panier',
              variant: 'destructive',
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
    
    // Add auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN' && !session) {
        // User just signed in, reload cart from server
        loadCart();
      } else if (event === 'SIGNED_OUT') {
        // User signed out, load cart from localStorage
        setSession(null);
        loadCart();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [toast]);
  
  // Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (loading) return;
      
      try {
        if (session) {
          // If logged in, save cart to Supabase
          // First clear the existing cart
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', session.user.id);
          
          // Then insert new items
          if (cartItems.length > 0) {
            const { error } = await supabase
              .from('cart_items')
              .insert(
                cartItems.map(item => ({
                  user_id: session.user.id,
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
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder votre panier',
          variant: 'destructive',
        });
      }
    };
    
    saveCart();
  }, [cartItems, loading, session, toast]);
  
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
  
  return {
    cartItems,
    loading,
    isAuthenticated: !!session,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};

// Export the hook for use in other components
export { useCart };

// Cart page component
export default function Cart() {
  const { 
    cartItems, 
    loading, 
    isAuthenticated,
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal,
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Code promo manquant',
        description: 'Veuillez entrer un code promo',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Code promo invalide',
      description: 'Le code promo n\'est pas valide ou a expiré',
      variant: 'destructive',
    });
  };
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour finaliser votre commande',
        variant: 'destructive',
      });
      return;
    }
    
    // Implement checkout logic here
    toast({
      title: 'Fonctionnalité en développement',
      description: 'Le processus de paiement est en cours de développement',
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer vos achats
          </Link>
          
          <h1 className="text-2xl font-serif font-medium ml-auto">Votre Panier</h1>
          
          <ShoppingCart className="ml-2 h-6 w-6 text-terracotta-600" />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Chargement de votre panier...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-16 w-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits artisanaux et ajoutez-les à votre panier.
            </p>
            <Link to="/categories">
              <Button className="bg-terracotta-600 hover:bg-terracotta-700">
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Articles ({cartItems.length})</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Vider le panier
                  </Button>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-6">
                  {cartItems.map((item) => item.product && (
                    <div key={`${item.productId}-${JSON.stringify(item.variations)}`} className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={item.product.images[0] || '/placeholder.svg'} 
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">
                              <Link 
                                to={`/products/${item.productId}`}
                                className="hover:text-terracotta-600 transition-colors"
                              >
                                {item.product.title}
                              </Link>
                            </h3>
                            
                            {Object.entries(item.variations || {}).length > 0 && (
                              <div className="mt-1 text-sm text-muted-foreground">
                                {Object.entries(item.variations || {}).map(([key, value]) => (
                                  <span key={key} className="mr-4">
                                    {key}: <span className="font-medium">{value}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => removeFromCart(item.productId, item.variations)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variations)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variations)}
                              disabled={item.quantity >= (item.product.stock || 10)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            {item.product.discountPrice ? (
                              <>
                                <div className="font-medium">
                                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.product.discountPrice * item.quantity)}
                                </div>
                                <div className="text-sm line-through text-muted-foreground">
                                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.product.price * item.quantity)}
                                </div>
                              </>
                            ) : (
                              <div className="font-medium">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.product.price * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
                
                <Separator className="mb-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getCartTotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>Calculé à l'étape suivante</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>Calculées à l'étape suivante</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg mb-6">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getCartTotal())}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Code promo"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon}
                    >
                      Appliquer
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700 py-6"
                    onClick={handleCheckout}
                  >
                    Passer à la caisse
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-center text-muted-foreground">
                      <Link to="/auth" className="text-terracotta-600 hover:underline">
                        Connectez-vous
                      </Link> pour sauvegarder votre panier et accéder à vos commandes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      <FixedNavMenu />
    </div>
  );
}
