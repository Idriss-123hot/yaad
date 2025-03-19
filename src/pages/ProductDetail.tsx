
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/ui/ProductCard';
import { SAMPLE_PRODUCTS, Product } from '@/models/types';
import { Star, Truck, ShieldCheck, Heart, Share2, ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { categoriesData } from '@/data/categories';

const ProductDetail = () => {
  const { mainCategory, subCategory, product: productId } = useParams<{ 
    mainCategory: string;
    subCategory: string;
    product: string;
  }>();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Recherche du produit dans les données
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Simulation de chargement
    setLoading(true);
    
    // Dans un cas réel, nous ferions une requête API
    // Pour la démo, utilisons un produit aléatoire des SAMPLE_PRODUCTS
    setTimeout(() => {
      const product = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];
      setProductData(product);
      
      // Produits connexes (simplement d'autres produits aléatoires)
      const related = SAMPLE_PRODUCTS.filter(p => p.id !== product.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRelatedProducts(related);
      
      setLoading(false);
    }, 500);
  }, [productId, mainCategory, subCategory]);

  // Incrémente la quantité
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  // Décrémente la quantité
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Ajouter au panier
  const addToCart = () => {
    toast({
      title: "Produit ajouté au panier",
      description: `Vous avez ajouté ${quantity} ${productData?.title} à votre panier.`,
    });
  };

  // Ajouter aux favoris
  const addToWishlist = () => {
    toast({
      title: "Produit ajouté aux favoris",
      description: "Vous pouvez consulter votre liste de favoris dans votre compte."
    });
  };

  // Trouver la catégorie et sous-catégorie
  const mainCategoryData = categoriesData.find(cat => cat.id === mainCategory);
  const subCategoryData = mainCategoryData?.subcategories.find(subCat => subCat.id === subCategory);

  // Options de couleur fictives
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
            <div className="w-12 h-12 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!productData) {
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
              <Link to="/categories">Voir toutes les catégories</Link>
            </Button>
          </div>
        </main>
        <Footer />
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
              {mainCategoryData && (
                <>
                  <Link to={`/categories/${mainCategory}`} className="hover:text-terracotta-600 transition-colors">
                    {mainCategoryData.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </>
              )}
              {subCategoryData && (
                <>
                  <Link to={`/categories/${mainCategory}/${subCategory}`} className="hover:text-terracotta-600 transition-colors">
                    {subCategoryData.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </>
              )}
              <span className="text-foreground truncate max-w-[200px]">{productData.title}</span>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-cream-50 rounded-lg overflow-hidden">
                  {productData.images && productData.images.length > 0 ? (
                    <img 
                      src={productData.images[0]} 
                      alt={productData.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Product Image
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className="aspect-square bg-cream-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {productData.images && idx < productData.images.length ? (
                        <img 
                          src={productData.images[idx]} 
                          alt={`${productData.title} - View ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          View {idx + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                {/* Title & Rating */}
                <h1 className="font-serif text-3xl font-bold mb-2">{productData.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(productData.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {productData.rating.toFixed(1)} ({productData.reviewCount} avis)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {productData.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-terracotta-600">
                        {productData.discountPrice.toFixed(2)} €
                      </span>
                      <span className="ml-3 text-lg text-muted-foreground line-through">
                        {productData.price.toFixed(2)} €
                      </span>
                      <span className="ml-3 bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded-full text-xs font-medium">
                        {Math.round((1 - productData.discountPrice / productData.price) * 100)}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-terracotta-600">
                      {productData.price.toFixed(2)} €
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  {productData.description}
                </p>

                {/* Color Options */}
                <div className="mb-6">
                  <p className="font-medium mb-2">Couleur</p>
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
                      {productData.stock} en stock
                    </span>
                  </div>
                </div>

                {/* Add to Cart & Wishlist */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
                  <Button 
                    onClick={addToCart}
                    className="flex-1 bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                  <Button 
                    onClick={addToWishlist}
                    variant="outline"
                    className="flex-1"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Ajouter aux favoris
                  </Button>
                </div>

                {/* Shipping & Returns */}
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

                {/* Share & Artisan */}
                <div className="flex items-center justify-between text-sm">
                  <button className="flex items-center text-muted-foreground hover:text-terracotta-600 transition-colors">
                    <Share2 className="h-4 w-4 mr-1" />
                    Partager
                  </button>
                  <Link 
                    to={`/artisans/${productData.artisanId}`} 
                    className="text-terracotta-600 hover:underline"
                  >
                    Voir l'artisan
                  </Link>
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
                <TabsTrigger value="details">Détails du produit</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({productData.reviewCount})</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-lg mb-4">À propos de ce produit</h3>
                <p className="text-muted-foreground mb-4">
                  {productData.description}
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
                      Argile, émaux naturels
                    </p>
                    <p className="font-medium mb-1">Dimensions</p>
                    <p className="text-muted-foreground mb-4">
                      H: 20 cm, L: 15 cm, P: 15 cm
                    </p>
                    <p className="font-medium mb-1">Poids</p>
                    <p className="text-muted-foreground">
                      0.8 kg
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Origine</p>
                    <p className="text-muted-foreground mb-4">
                      Maroc
                    </p>
                    <p className="font-medium mb-1">Entretien</p>
                    <p className="text-muted-foreground mb-4">
                      Nettoyage à l'eau savonneuse, ne pas mettre au lave-vaisselle
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
                  <h3 className="font-medium text-lg">Avis clients ({productData.reviewCount})</h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(productData.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{productData.rating.toFixed(1)}/5</span>
                  </div>
                </div>
                
                {/* Reviews */}
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
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
                  ))}
                </div>
                
                <Button className="mt-8 bg-terracotta-600 hover:bg-terracotta-700 text-white">
                  Voir tous les avis
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
