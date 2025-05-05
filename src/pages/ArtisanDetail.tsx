import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Artisan, ProductWithArtisan } from '@/models/types';
import { Loader2, MapPin, Globe, Calendar } from 'lucide-react';

const ArtisanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisanDetails = async () => {
      if (!id) {
        setError("Artisan ID is missing");
        setLoading(false);
        return;
      }

      try {
        // Fetch artisan data - using direct fields instead of joins to avoid recursion
        const { data: artisanData, error: artisanError } = await supabase
          .from('artisans')
          .select('*')
          .eq('id', id)
          .single();

        if (artisanError) {
          throw new Error(artisanError.message);
        }

        if (!artisanData) {
          setError("Artisan not found");
          setLoading(false);
          return;
        }

        // Map to our artisan model
        const mappedArtisan: Artisan = {
          id: artisanData.id,
          name: artisanData.name,
          bio: artisanData.bio || '',
          description: artisanData.description || '',
          location: artisanData.location || 'Morocco',
          profileImage: artisanData.profile_photo || '/placeholder.svg',
          galleryImages: Array.isArray(artisanData.first_gallery_images) 
            ? artisanData.first_gallery_images 
            : [],
          rating: artisanData.rating || 4.5,
          reviewCount: artisanData.review_count || 0,
          productCount: 0, // We'll calculate this below
          featured: artisanData.featured || false,
          joinedDate: new Date(artisanData.joined_date),
          website: artisanData.website || ''
        };
        
        setArtisan(mappedArtisan);

        // Fetch products by this artisan using separate queries to avoid recursion
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:category_id(id, name)
          `)
          .eq('artisan_id', id);

        if (productsError) {
          throw new Error(productsError.message);
        }

        // Map products to our model
        const mappedProducts = productsData.map(product => {
          return {
            id: product.id,
            title: product.title,
            description: product.description || '',
            price: product.price,
            discountPrice: product.discount_price,
            category: product.category?.name || '',
            categoryId: product.category_id,
            subcategory: '',
            subcategoryId: product.subcategory_id,
            tags: product.tags || [],
            images: product.images || [],
            stock: product.stock,
            artisanId: product.artisan_id,
            rating: product.rating || 0,
            reviewCount: product.review_count || 0,
            featured: product.featured || false,
            createdAt: new Date(product.created_at),
            material: product.material,
            origin: product.origin,
            artisan: mappedArtisan
          } as ProductWithArtisan;
        });

        setProducts(mappedProducts);
        
        // Update productCount in the artisan object
        mappedArtisan.productCount = mappedProducts.length;
        setArtisan(mappedArtisan);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching artisan details:", err);
        setError("Failed to load artisan details");
        setLoading(false);
      }
    };

    fetchArtisanDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-terracotta-600" />
            <p className="text-muted-foreground">Chargement des détails de l'artisan...</p>
          </div>
        </main>
        <Footer />
        <FixedNavMenu />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Artisan non trouvé</h1>
            <p className="text-muted-foreground mb-6">
              Désolé, l'artisan que vous recherchez n'existe pas.
            </p>
            <Button asChild>
              <Link to="/artisans">Voir tous les artisans</Link>
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
        {/* Artisan Hero Section */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Artisan Image */}
              <div className="w-full md:w-1/3">
                <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                  {artisan.profileImage ? (
                    <img 
                      src={artisan.profileImage} 
                      alt={artisan.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">
                        {artisan.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Artisan Info */}
              <div className="w-full md:w-2/3">
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{artisan.name}</h1>
                
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-4">
                  {artisan.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{artisan.location}</span>
                    </div>
                  )}
                  
                  {artisan.joinedDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Membre depuis {new Date(artisan.joinedDate).getFullYear()}</span>
                    </div>
                  )}
                  
                  {/* Badge for featured artisans */}
                  {artisan.featured && (
                    <span className="bg-terracotta-100 text-terracotta-800 px-2 py-1 rounded-full text-xs font-medium">
                      Artisan en Vedette
                    </span>
                  )}
                </div>
                
                <p className="text-lg mb-6">{artisan.bio}</p>
                
                {artisan.website && (
                  <a 
                    href={artisan.website.startsWith('http') ? artisan.website : `https://${artisan.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-terracotta-600 hover:underline mb-6"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visiter le site web
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {artisan.galleryImages && artisan.galleryImages.length > 0 && (
          <section className="py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-serif text-2xl font-bold mb-6">Galerie de l'artisan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artisan.galleryImages.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${artisan.name} - Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Produits par {artisan.name} 
              <span className="text-muted-foreground font-normal text-lg ml-2">
                ({products.length} produits)
              </span>
            </h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Aucun produit disponible pour le moment.</p>
                <Button asChild>
                  <Link to="/artisans">Voir d'autres artisans</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        {artisan.description && (
          <section className="py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-serif text-2xl font-bold mb-6">À propos de {artisan.name}</h2>
              <div className="prose max-w-none">
                <p>{artisan.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* Back Button */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              Retour
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default ArtisanDetail;
