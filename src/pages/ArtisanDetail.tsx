
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { SAMPLE_ARTISANS, SAMPLE_PRODUCTS, Product } from '@/models/types';

const ArtisanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Find the artisan by id
  const artisan = SAMPLE_ARTISANS.find(a => a.id === id);
  
  // Filter products by artisan id
  const artisanProducts = SAMPLE_PRODUCTS.filter(
    product => product.artisanId === artisan?.id
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(artisanProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = artisanProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric'
    }).format(date);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll to top on page load or artisan change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setCurrentPage(1);
  }, [id]);

  if (!artisan) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Artisan Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, the artisan you're looking for doesn't exist.
            </p>
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
        {/* Artisan Profile */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Artisan Image */}
              <div className="md:col-span-1">
                <div className="rounded-lg overflow-hidden shadow-md aspect-square">
                  <img 
                    src={artisan.profileImage} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Artisan Info */}
              <div className="md:col-span-2">
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{artisan.name}</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{artisan.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {formatDate(artisan.joinedDate)}</span>
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, index) => (
                      <Star 
                        key={index} 
                        className={`h-4 w-4 ${index < Math.floor(artisan.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {artisan.rating.toFixed(1)} ({artisan.reviewCount} reviews)
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-8">
                  {artisan.bio}
                </p>
                
                {/* Gallery Preview */}
                {artisan.galleryImages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-3">Gallery</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {artisan.galleryImages.map((image, index) => (
                        <div key={index} className="aspect-square rounded overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Artisan Reviews */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6">Customer Reviews</h2>
            
            {/* Sample Reviews - In a real app, these would be fetched from a database */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index}
                          className={`h-4 w-4 ${index < 5 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-4">
                    "The craftsmanship is absolutely stunning. Every detail shows the care and expertise that went into making this piece."
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Sarah J.</span> - 3 months ago
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star 
                          key={index}
                          className={`h-4 w-4 ${index < 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-4">
                    "Beautiful work and arrived earlier than expected. The quality is exceptional and worth every penny."
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Michael T.</span> - 1 month ago
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Artisan Products */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8">Products by {artisan.name}</h2>
            
            {currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                            />
                          </PaginationItem>
                        )}
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              isActive={currentPage === i + 1}
                              onClick={() => handlePageChange(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No Products Found</h3>
                <p className="text-muted-foreground">
                  This artisan hasn't added any products yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArtisanDetail;
