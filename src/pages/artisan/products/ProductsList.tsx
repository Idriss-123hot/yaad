import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Image, Search, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithArtisan } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { debounce } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const ArtisanProductsList: React.FC = () => {
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch products that belong to the logged-in artisan
  const fetchArtisanProducts = async (searchTerm = '') => {
    setLoading(true);
    
    try {
      // First, get the artisan ID for the current user
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('id')
        .eq('user_id', user?.id)
        .single();
      
      if (artisanError) {
        throw new Error('Could not find artisan account for current user');
      }
      
      const artisanId = artisanData.id;
      
      // Now fetch the products for this artisan
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*),
          artisan:artisans(*)
        `)
        .eq('artisan_id', artisanId);
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map the data to our format
      const mappedProducts = data.map(item => mapDatabaseProductToProduct(item));
      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchArtisanProducts();
    }
  }, [user]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((value: string) => {
    fetchArtisanProducts(value);
  }, 300);

  // Delete product
  const handleDelete = async (productId: string) => {
    setDeleting(productId);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update products list
      setProducts(products.filter(product => product.id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Could not delete product: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  // Format price
  const formatPrice = (price?: number) => {
    if (price === undefined) return '—';
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <ArtisanLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Products</h1>
          <Button onClick={() => navigate('/artisan/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>
              Manage your products, edit information or add new ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {search ? 'No products match your search' : 'No products available'}
                </p>
                {!search && (
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/artisan/products/new')}
                    className="mt-2"
                  >
                    Create your first product
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <div className="w-16 h-16 rounded overflow-hidden border">
                              <img 
                                src={product.images[0]} 
                                alt={product.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center border">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.title}
                          {product.featured && (
                            <Badge className="ml-2 bg-amber-500">Featured</Badge>
                          )}
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          {product.discountPrice ? (
                            <div>
                              <span className="line-through text-muted-foreground text-sm mr-2">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-red-600 font-semibold">
                                {formatPrice(product.discountPrice)}
                              </span>
                            </div>
                          ) : (
                            formatPrice(product.price)
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                            {product.stock > 0 ? product.stock : 'Out of stock'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/artisan/products/${product.id}/edit`)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this product? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleDelete(product.id)}
                                    disabled={deleting === product.id}
                                  >
                                    {deleting === product.id && (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ArtisanLayout>
  );
};

export default ArtisanProductsList;
