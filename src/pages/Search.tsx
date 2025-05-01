
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { ProductCard } from '@/components/ui/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import { ProductWithArtisan } from '@/models/types';
import { SearchFilters } from '@/services/search';
import { searchProducts, debouncedSearch, filtersToURLParams, getFiltersFromURL } from '@/services/search';
import { useLocation, useNavigate } from 'react-router-dom';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [filters, setFilters] = useState<Partial<SearchFilters>>({
    q: '',
    category: [], 
    subcategory: [], 
    artisans: [], 
    priceRange: [0, 1000] as [number, number],
    sort: 'featured',
  });
  
  // Initialize filters from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = getFiltersFromURL(searchParams);
    setFilters(prev => ({
      ...prev,
      ...urlFilters
    }));
  }, [location.search]);
  
  // Update URL when filters change
  useEffect(() => {
    const queryParams = filtersToURLParams(filters);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    
    // Only update if URL would actually change
    if (location.search !== `?${queryParams.toString()}`) {
      navigate(newUrl, { replace: true });
    }
  }, [filters, navigate, location.pathname]);
  
  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        console.log("Searching products with filters:", filters); // Debug log
        // Use the searchProducts function from our search service
        const results = await searchProducts(filters as SearchFilters);
        setProducts(results.products);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
      }
      
      setIsLoading(false);
    };
    
    // Debounce search to avoid too many requests
    const timerId = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [filters]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      q: e.target.value
    }));
  };
  
  const handleClearSearch = () => {
    setFilters(prev => ({
      ...prev,
      q: ''
    }));
  };
  
  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      sort: e.target.value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Explorer Nos Produits</h1>
          
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-10"
              value={filters.q}
              onChange={handleSearchChange}
            />
            {filters.q && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6 mb-10">
            <div className="w-full md:w-1/4 lg:w-1/5 mb-6 md:mb-0">
              <Button
                variant="outline"
                size="sm"
                className="flex md:hidden items-center mb-4 w-full"
                onClick={handleToggleFilters}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
              </Button>
              
              <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
                <AdvancedFilters 
                  isOpen={showFilters}
                  onClose={() => setShowFilters(false)}
                  initialFilters={filters}
                  onApplyFilters={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">
                  {products.length} produits
                </span>
                
                <div className="flex items-center ml-auto">
                  <select
                    className="text-sm border rounded px-2 py-1 bg-white"
                    value={filters.sort}
                    onChange={handleSortChange}
                  >
                    <option value="featured">En vedette</option>
                    <option value="price-asc">Prix: Croissant</option>
                    <option value="price-desc">Prix: Décroissant</option>
                    <option value="newest">Plus récent</option>
                    <option value="rating">Les mieux notés</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
                  <span className="ml-2 text-lg text-terracotta-600">Chargement...</span>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <img 
                    src="https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//no-results.svg" 
                    alt="Aucun produit trouvé" 
                    className="h-40 w-40 mb-4 opacity-50"
                    onError={(e) => {
                      e.currentTarget.src = "/no-results.svg";
                    }}
                  />
                  <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos filtres ou d'utiliser un autre terme de recherche.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        q: '',
                        category: [],
                        subcategory: [],
                        artisans: [],
                        priceRange: [0, 1000] as [number, number],
                        sort: 'featured',
                      });
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FixedNavMenu />
    </div>
  );
};

export default Search;
