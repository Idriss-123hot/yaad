import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithArtisan } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { ProductGallery } from '@/components/product/ProductGallery';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { Star, Truck, ShieldCheck, Heart, Share2, ChevronRight, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [product, setProduct] = useState<ProductWithArtisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if the product is in the wishlist
  const isInWishlist = wishlistItems.some(item => item.productId === id);

  // Fetch the product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/products');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch the product with its related artisan
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            artisan:artisans(*),
            category:categories(*),
            subcategory:subcategories(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          // Map the database product to our ProductWithArtisan model
          const mappedProduct = mapDatabaseProductToProduct(data);
          setProduct(mappedProduct);
        } else {
          // Product not found
          setError('Product not found');
          navigate('/products');
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, navigate]);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    // This would normally call a cart service/hook
    toast({
      title: "Product added to cart",
      description: `You have added ${quantity} ${product?.title} to your cart.`,
    });
  };

  // Add to wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to add products to your wishlist",
      });
      navigate('/auth', { state: { from: `/products/${id}` } });
      return;
    }
    
    try {
      if (isInWishlist) {
        await removeFromWishlist(id!);
        toast({
          title: "Removed from favorites",
          description: "Product has been removed from your favorites"
        });
      } else {
        await addToWishlist(id!);
        toast({
          title: "Added to favorites",
          description: "Product has been added to your favorites"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  // Color options for the product
  const colorOptions = [
    { name: 'Natural', value: 'natural', hex: '#D2B48C' },
    { name: 'Terracotta', value: 'terracotta', hex: '#b06a5b' },
    { name: 'Blue', value: 'blue', hex: '#4682B4' },
    { name: 'Green', value: 'green', hex: '#556B2F' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-terracotta-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
        <FixedNavMenu />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "We couldn't find the product you're looking for."}
            </p>
            <Button asChild>
              <Link to="/products">Browse All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <FixedNavMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Breadcrumb */}
        <section className="bg-cream-50 py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
              <Link to="/" className="hover:text-terracotta-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/products" className="hover:text-terracotta-600 transition-colors">
                Products
              </Link>
              {product.category && (
                <>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <Link 
                    to={`/categories/${product.categoryId}/products`} 
                    className="hover:text-terracotta-600 transition-colors"
                  >
                    {product.category}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <ProductGallery images={product.images || []} title={product.title} />

              {/* Product Info */}
              <div>
                {/* Title & Rating */}
                <h1 className="font-serif text-3xl font-bold mb-2">{product.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {product.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-terracotta-600">
                        {product.discountPrice.toFixed(2)} €
                      </span>
                      <span className="ml-3 text-lg text-muted-foreground line-through">
                        {product.price.toFixed(2)} €
                      </span>
                      <span className="ml-3 bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-terracotta-600">
                      {product.price.toFixed(2)} €
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>

                {/* Color Options */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Color</p>
                  <div className="flex space-x-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-terracotta-600' : 'border-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Quantity</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={decrementQuantity}
                        className="px-3 py-2 text-muted-foreground hover:text-terracotta-600 disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button 
                        onClick={incrementQuantity}
                        className="px-3 py-2 text-muted-foreground hover:text-terracotta-600 disabled:opacity-50"
                        disabled={quantity >= 10 || quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>

                {/* Add to Cart & Wishlist */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                    disabled={product.stock < 1}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button 
                    onClick={handleToggleWishlist}
                    variant="outline"
                    className={`flex-1 ${isInWishlist ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-rose-500' : ''}`} />
                    {isInWishlist ? 'In Favorites' : 'Add to Favorites'}
                  </Button>
                </div>

                {/* Shipping & Returns */}
                <div className="bg-cream-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start mb-3">
                    <Truck className="h-5 w-5 text-terracotta-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-muted-foreground">
                        Free shipping in France from €100. Estimated time: 5-7 business days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-terracotta-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Returns</p>
                      <p className="text-sm text-muted-foreground">
                        Returns accepted within 14 days for non-personalized products.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Share & Artisan */}
                <div className="flex items-center justify-between text-sm">
                  <button className="flex items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  {product.artisan && (
                    <Link 
                      to={`/artisans/${product.artisanId}`} 
                      className="text-terracotta-600 hover:underline"
                    >
                      View Artisan
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              </TabsList>
              
              {/* Description Tab */}
              <TabsContent value="description" className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">About this product</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <p className="text-muted-foreground mb-4">
                  This product is handmade by talented artisans in Morocco. Each piece is unique and may have slight variations in color, size, and shape, reflecting its authenticity and artisanal character.
                </p>
                <p className="text-muted-foreground">
                  The materials used are carefully selected for their quality and durability. This product is designed to last and bring a touch of authenticity to your interior for many years.
                </p>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-medium mb-1">Materials</p>
                    <p className="text-muted-foreground mb-4">
                      {product.material || 'Authentic Moroccan materials'}
                    </p>
                    <p className="font-medium mb-1">Dimensions</p>
                    <p className="text-muted-foreground mb-4">
                      Varies depending on the product
                    </p>
                    <p className="font-medium mb-1">Weight</p>
                    <p className="text-muted-foreground">
                      Varies depending on the product
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Origin</p>
                    <p className="text-muted-foreground mb-4">
                      {product.origin || 'Morocco'}
                    </p>
                    <p className="font-medium mb-1">Maintenance</p>
                    <p className="text-muted-foreground mb-4">
                      Varies depending on the product
                    </p>
                    <p className="font-medium mb-1">Made by hand</p>
                    <p className="text-muted-foreground">
                      Yes
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-medium text-lg">Customer Reviews ({product.reviewCount})</h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{product.rating.toFixed(1)}/5</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Satisfied Customer</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < 5 - idx ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * idx).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground">
                        {idx === 0 ? (
                          "Superb quality and beautiful design. I am very satisfied with my purchase. The product is exactly as described and the finish is impeccable."
                        ) : idx === 1 ? (
                          "Very beautiful piece of artisanal furniture that found its place in my living room. The delivery was quick and the packaging was well done. I highly recommend!"
                        ) : (
                          "Good product but a little smaller than I expected. The quality is still excellent and the customer service very responsive."
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button className="mt-8 bg-terracotta-600 hover:bg-terracotta-700 text-white">
                  View all reviews
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        <RelatedProducts 
          currentProductId={product.id}
          categoryId={product.categoryId}
          artisanId={product.artisanId}
          maxProducts={4}
        />
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default ProductDetail;
