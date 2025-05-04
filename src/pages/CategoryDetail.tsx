
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Product, Category } from '@/models/types';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { useQuery } from '@tanstack/react-query';

// Helper function to fetch category by slug
const fetchCategoryBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data as Category;
};

// Helper function to fetch products by category ID
const fetchProductsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      artisan:artisan_id (*)
    `)
    .eq('category_id', categoryId);
  
  if (error) throw error;
  return data.map(mapDatabaseProductToProduct);
};

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Fetch category data
  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug || ''),
    enabled: !!slug
  });

  // Fetch products for the category
  const { data: categoryProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['categoryProducts', category?.id],
    queryFn: () => fetchProductsByCategory(category?.id || ''),
    enabled: !!category?.id
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(categoryProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth scroll to top on page load or category change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setCurrentPage(1);
  }, [slug]);

  // Loading state
  if (categoryLoading || productsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Loading...</h1>
            <p className="text-muted-foreground">
              Please wait while we fetch the category details.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (categoryError || !category) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, the category you're looking for doesn't exist.
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
        {/* Category Header */}
        <section 
          className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center text-white px-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="max-w-2xl mx-auto">{category.description}</p>
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
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
                  There are currently no products in this category.
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

export default CategoryDetail;
