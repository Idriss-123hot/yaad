import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { ProductWithArtisan } from '@/models/types';
import { toast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ui/ProductCard';
import { useWishlistContext } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductWithArtisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithArtisan[]>([]);
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlistContext();
  
  useEffect(() => {
    setCurrentImageIndex(0);
    
    if (!productId) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }
    
    const fetchProduct = async () => {
      try {
        // Fetch the product with its relations
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            artisan:artisans(*),
            category:categories(*),
            subcategory:subcategories(*)
          `)
          .eq('id', productId)
          .single();
        
        if (productError) {
          throw new Error(productError.message);
        }
        
        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        
        // Map to our product model
        const mappedProduct = mapDatabaseProductToProduct(productData);
        setProduct(mappedProduct);
        
        // Fetch related products in the same category
        if (productData.category_id) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select(`
              *,
              artisan:artisans(*),
              category:categories(*),
              subcategory:subcategories(*)
            `)
            .eq('category_id', productData.category_id)
            .neq('id', productId)
            .limit(4);
          
          if (!relatedError && relatedData) {
            const mappedRelated = relatedData.map(item => mapDatabaseProductToProduct(item));
            setRelatedProducts(mappedRelated);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} × ${product?.title} a été ajouté à votre panier.`,
    });
  };
  
  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product.id);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-terracotta-600" />
            <p className="text-muted-foreground">Chargement du produit...</p>
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
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              Désolé, le produit que vous recherchez n'existe pas.
            </p>
            <Button asChild>
              <Link to="/">Retour à l'accueil</Link>
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
        <section className="bg-cream-50 py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
              <Link to="/" className="hover:text-terracotta-600 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              {product.category && (
                <>
                  <Link to={`/categories/${product.mainCategory}`} className="hover:text-terracotta-600 transition-colors">
                    {product.category}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </>
              )}
              {product.subcategory && (
                <>
                  <Link to={`/categories/${product.mainCategory}/${product.subcategory?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-terracotta-600 transition-colors">
                    {product.subcategory}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </>
              )}
              <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
            </div>
          </div>
        </section>

        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-cream-50 rounded-lg overflow-hidden">
                  <img 
                    src={product?.images[currentImageIndex]} 
                    alt={product?.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
                    }}
                  />
                </div>
                {product?.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`aspect-square bg-cream-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${currentImageIndex === idx ? 'ring-2 ring-terracotta-600' : ''}`}
                        onClick={() => handleThumbnailClick(idx)}
                      >
                        <img 
                          src={img} 
                          alt={`${product.title} - View ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
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
                    {product.rating.toFixed(1)} ({product.reviewCount} avis)
                  </span>
                </div>

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

                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>

                <div className="mb-6">
                  <p className="font-medium mb-2">Quantité</p>
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
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} en stock
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                  <Button 
                    onClick={handleAddToWishlist}
                    variant="outline"
                    className={`flex-1 ${isInWishlist && isInWishlist(product.id) ? 'bg-terracotta-50 border-terracotta-300' : ''}`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isInWishlist && isInWishlist(product.id) ? 'fill-terracotta-600 text-terracotta-600' : ''}`} />
                    {isInWishlist && isInWishlist(product.id) ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                  </Button>
                </div>

                <div className="bg-cream-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start mb-3">
                    <Truck className="h-5 w-5 text-terracotta-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison</p>
                      <p className="text-sm text-muted-foreground">
                        Livraison gratuite en France à partir de 100€. Délai estimé : 5-7 jours ouvrables.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-terracotta-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Retours</p>
                      <p className="text-sm text-muted-foreground">
                        Retours acceptés sous 14 jours pour les produits non personnalisés.
                      </p>
                    </div>
                  </div>
                </div>

                {product.artisan && (
                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium mb-2">Artisan</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {product.artisan.profileImage ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <img 
                              src={product.artisan.profileImage} 
                              alt={product.artisan.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <span className="text-lg font-serif text-gray-400">
                              {product.artisan.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.artisan.name}</p>
                          {product.artisan.location && (
                            <p className="text-sm text-muted-foreground">{product.artisan.location}</p>
                          )}
                        </div>
                      </div>
                      <Link 
                        to={`/artisan/${product.artisanId}`} 
                        className="text-terracotta-600 hover:underline"
                      >
                        Voir l'artisan
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mt-4">
                  <button className="flex items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
                    <Share2 className="h-4 w-4 mr-1" />
                    Partager
                  </button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center text-muted-foreground hover:text-terracotta-600"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="description">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Détails du produit</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({product.reviewCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">À propos de ce produit</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <p className="text-muted-foreground mb-4">
                  Ce produit est fabriqué à la main par des artisans talentueux au Maroc. Chaque pièce est unique et peut présenter de légères variations dans la couleur, la taille et la forme, ce qui témoigne de son authenticité et de son caractère artisanal.
                </p>
                <p className="text-muted-foreground">
                  Les matériaux utilisés sont soigneusement sélectionnés pour leur qualité et leur durabilité. Ce produit est conçu pour durer et apporter une touche d'authenticité à votre intérieur pendant de nombreuses années.
                </p>
              </TabsContent>
              <TabsContent value="details" className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">Spécifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-medium mb-1">Matériaux</p>
                    <p className="text-muted-foreground mb-4">
                      {product.material || 'Matériaux authentiques marocains'}
                    </p>
                    <p className="font-medium mb-1">Dimensions</p>
                    <p className="text-muted-foreground mb-4">
                      Varie selon le produit
                    </p>
                    <p className="font-medium mb-1">Poids</p>
                    <p className="text-muted-foreground">
                      Varie selon le produit
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Origine</p>
                    <p className="text-muted-foreground mb-4">
                      {product.origin || 'Maroc'}
                    </p>
                    <p className="font-medium mb-1">Entretien</p>
                    <p className="text-muted-foreground mb-4">
                      Varie selon le produit
                    </p>
                    <p className="font-medium mb-1">Fait à la main</p>
                    <p className="text-muted-foreground">
                      Oui
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-medium text-lg">Avis clients ({product.reviewCount})</h3>
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
                  {product.reviewCount > 0 ? (
                    [...Array(Math.min(3, product.reviewCount))].map((_, idx) => (
                      <div key={idx} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Client satisfait</h4>
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
                            "Superbe qualité et design magnifique. Je suis très satisfait de mon achat. Le produit est exactement comme décrit et les finitions sont impeccables."
                          ) : idx === 1 ? (
                            "Très belle pièce artisanale qui a trouvé sa place dans mon salon. L'expédition a été rapide et l'emballage soigné. Je recommande vivement !"
                          ) : (
                            "Beau produit mais un peu plus petit que ce que j'imaginais. La qualité est néanmoins au rendez-vous et le service client très réactif."
                          )}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-6">
                      Aucun avis pour le moment. Soyez le premier à donner votre avis sur ce produit !
                    </p>
                  )}
                </div>
                
                {product.reviewCount > 3 && (
                  <Button className="mt-8 bg-terracotta-600 hover:bg-terracotta-700 text-white">
                    Voir tous les avis
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-serif text-2xl font-bold mb-8">Vous aimerez aussi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default ProductPage;
