
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X, Loader2, ShoppingBag, User } from 'lucide-react';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';
import { Product } from '@/models/types';

interface SearchResult {
  products?: Product[];
  artisans?: any[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<SearchResult>({});
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedTerm || debouncedTerm.length < 2) {
        setResults({});
        return;
      }

      setIsLoading(true);

      try {
        // Use the search edge function with query parameters in the URL
        const { data, error } = await supabase.functions.invoke('search', {
          method: 'GET',
          queryParams: { 
            q: debouncedTerm, 
            type: activeTab 
          }
        });

        if (error) throw error;

        // Map database products to our Product interface
        if (data.products) {
          data.products = data.products.map(mapDatabaseProductToProduct);
        }

        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults({});
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedTerm, activeTab]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  const handleArtisanClick = (artisanId: string) => {
    navigate(`/artisans/${artisanId}`);
    onClose();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults({});
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Rechercher un produit, un artisan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-6"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="artisans">Artisans</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
            </div>
          ) : !searchTerm || searchTerm.length < 2 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Saisissez au moins 2 caractères pour lancer une recherche</p>
            </div>
          ) : (
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="all" className="mt-0">
                {(!results.products || results.products.length === 0) && 
                 (!results.artisans || results.artisans.length === 0) ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun résultat pour "{searchTerm}"</p>
                  </div>
                ) : (
                  <>
                    {results.products && results.products.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-medium text-lg mb-3 flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Produits
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {results.products.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleProductClick(product.id)}
                            >
                              <div className="h-16 w-16 rounded bg-gray-100 overflow-hidden">
                                <img
                                  src={product.images[0] || '/placeholder.svg'}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium">{product.title}</h4>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                                <div className="text-sm font-medium text-terracotta-600">
                                  {product.discountPrice ? (
                                    <>
                                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.discountPrice)}
                                      {' '}
                                      <span className="text-muted-foreground line-through">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                                      </span>
                                    </>
                                  ) : (
                                    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {results.products.length > 4 && (
                          <Button
                            variant="link"
                            className="mt-2 text-terracotta-600"
                            onClick={() => {
                              setActiveTab('products');
                            }}
                          >
                            Voir tous les produits ({results.products.length})
                          </Button>
                        )}
                      </div>
                    )}

                    {results.artisans && results.artisans.length > 0 && (
                      <div>
                        <h3 className="font-medium text-lg mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Artisans
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {results.artisans.slice(0, 4).map((artisan) => (
                            <div
                              key={artisan.id}
                              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleArtisanClick(artisan.id)}
                            >
                              <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden">
                                <img
                                  src={artisan.profile_photo || '/placeholder.svg'}
                                  alt={artisan.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{artisan.name}</h4>
                                <p className="text-sm text-muted-foreground">{artisan.location}</p>
                                <div className="flex items-center text-sm">
                                  {[...Array(5)].map((_, index) => (
                                    <svg
                                      key={index}
                                      className={`w-3 h-3 ${
                                        index < Math.floor(artisan.rating)
                                          ? 'text-amber-500'
                                          : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1 text-xs">({artisan.review_count})</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {results.artisans.length > 4 && (
                          <Button
                            variant="link"
                            className="mt-2 text-terracotta-600"
                            onClick={() => {
                              setActiveTab('artisans');
                            }}
                          >
                            Voir tous les artisans ({results.artisans.length})
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="products" className="mt-0">
                {!results.products || results.products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun produit trouvé pour "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {results.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="h-20 w-20 rounded bg-gray-100 overflow-hidden">
                          <img
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{product.title}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                          <div className="text-sm font-medium text-terracotta-600 mt-1">
                            {product.discountPrice ? (
                              <>
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.discountPrice)}
                                {' '}
                                <span className="text-muted-foreground line-through">
                                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                                </span>
                              </>
                            ) : (
                              new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="artisans" className="mt-0">
                {!results.artisans || results.artisans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun artisan trouvé pour "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {results.artisans.map((artisan) => (
                      <div
                        key={artisan.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleArtisanClick(artisan.id)}
                      >
                        <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden">
                          <img
                            src={artisan.profile_photo || '/placeholder.svg'}
                            alt={artisan.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{artisan.name}</h4>
                          <p className="text-sm text-muted-foreground">{artisan.location}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{artisan.bio}</p>
                          <div className="flex items-center text-sm mt-1">
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                className={`w-3 h-3 ${
                                  index < Math.floor(artisan.rating)
                                    ? 'text-amber-500'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-xs">({artisan.review_count})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="p-4 border-t text-center">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
