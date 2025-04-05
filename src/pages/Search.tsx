
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { SearchBar } from '@/components/search/SearchBar';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProductsByCategory, PRODUCTS } from '@/data/products';
import { ProductWithArtisan } from '@/models/types';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subcategoryName, setSubcategoryName] = useState<string>('');
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Start building the query
        let productQuery = supabase
          .from('products')
          .select(`
            *,
            product_variations(*),
            artisan:artisans(*),
            category:categories(*),
            subcategory:subcategories(*)
          `);
        
        // Filter by category if provided
        if (category) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id, name')
            .eq('id', category)
            .maybeSingle();
            
          if (categoryData?.id) {
            productQuery = productQuery.eq('category_id', categoryData.id);
            setCategoryName(categoryData.name);
          }
        }
        
        // Filter by subcategory if provided
        if (subcategory) {
          const { data: subcategoryData } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('id', subcategory)
            .maybeSingle();
            
          if (subcategoryData?.id) {
            productQuery = productQuery.eq('subcategory_id', subcategoryData.id);
            setSubcategoryName(subcategoryData.name);
          }
        }
        
        // Add text search if query is provided
        if (query) {
          productQuery = productQuery.textSearch('search_vector', query, {
            config: 'english'
          });
        }
        
        const { data, error } = await productQuery;
        
        if (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        } else if (data) {
          const mappedProducts = data.map(product => mapDatabaseProductToProduct(product));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error in search:', error);
        
        // Fallback to static data if Supabase query fails
        let filteredProducts = PRODUCTS;
        
        if (category) {
          filteredProducts = getProductsByCategory(category, subcategory);
        }
        
        if (query) {
          const searchTerms = query.toLowerCase().split(' ');
          filteredProducts = filteredProducts.filter(product => {
            const searchableText = `${product.title} ${product.description} ${product.category}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
          });
        }
        
        setProducts(filteredProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category, subcategory]);
  
  // Handle filter application - now automatic without button click
  const handleFilterApply = (filters: any) => {
    // Update search params based on filters
    const newParams = new URLSearchParams(searchParams);
    
    if (filters.category) newParams.set('category', filters.category);
    else newParams.delete('category');
    
    if (filters.subcategory) newParams.set('subcategory', filters.subcategory);
    else newParams.delete('subcategory');
    
    if (filters.q) newParams.set('q', filters.q);
    else if (filters.q === '') newParams.delete('q');
    
    if (filters.minPrice !== undefined) newParams.set('minPrice', filters.minPrice.toString());
    else newParams.delete('minPrice');
    
    if (filters.maxPrice !== undefined) newParams.set('maxPrice', filters.maxPrice.toString());
    else newParams.delete('maxPrice');
    
    setSearchParams(newParams);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Search Header */}
        <section className="bg-cream-50 py-6 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Link to="/" className="hover:text-terracotta-600 transition-colors">
                  Accueil
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span>Recherche</span>
                {categoryName && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="hover:text-terracotta-600 transition-colors">
                      {categoryName}
                    </span>
                  </>
                )}
                {subcategoryName && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span>{subcategoryName}</span>
                  </>
                )}
              </div>
              
              {/* Search Bar */}
              <SearchBar initialQuery={query} />
              
              {/* Search Info */}
              <div className="flex justify-between items-center mt-4">
                <div>
                  <h1 className="text-xl font-medium">
                    {subcategoryName 
                      ? subcategoryName
                      : categoryName 
                        ? categoryName
                        : query 
                          ? `Résultats pour "${query}"`
                          : 'Tous les produits'
                    }
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {products.length} produits trouvés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Filters Sidebar - Now Always Visible */}
              <aside className="md:block">
                <h2 className="font-medium text-lg mb-4">Filtres</h2>
                <AdvancedFilters 
                  onApply={handleFilterApply}
                  initialFilters={{
                    q: query,
                    category: category,
                    subcategory: subcategory
                  }}
                />
              </aside>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:col-span-3">
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse"></div>
                  ))
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <h2 className="text-2xl font-medium mb-2">Aucun produit trouvé</h2>
                    <p className="text-muted-foreground mb-6">
                      Essayez d'autres termes de recherche ou filtres.
                    </p>
                    <Button asChild>
                      <Link to="/categories">Voir toutes les catégories</Link>
                    </Button>
                  </div>
                ) : (
                  products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Search;
