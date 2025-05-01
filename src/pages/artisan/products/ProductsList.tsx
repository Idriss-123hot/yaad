
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArtisanLayout } from '@/components/artisan/ArtisanLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCurrentArtisanId } from '@/utils/authUtils';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductsListProps {
  isAdmin?: boolean;
}

const ArtisanProductsList = ({ isAdmin = false }: ProductsListProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchArtisanProducts();
  }, []);
  
  const fetchArtisanProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current artisan's ID
      const artisanId = await getCurrentArtisanId();
      
      if (!artisanId) {
        throw new Error('Cannot retrieve artisan information');
      }
      
      // Fetch products for this artisan
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, id),
          subcategory:subcategories(name, id)
        `)
        .eq('artisan_id', artisanId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map database products to our product model
      const mappedProducts = data?.map(mapDatabaseProductToProduct) || [];
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
      toast({
        title: 'Error loading products',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
        
      if (error) throw error;
      
      // Remove the product from the local state
      setProducts(products.filter(product => product.id !== productToDelete));
      
      toast({
        title: 'Product deleted',
        description: 'Product has been successfully deleted',
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: 'Error deleting product',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  return (
    <ArtisanLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Products</h1>
          <Button asChild>
            <Link to="/artisan/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
                <h3 className="text-lg font-medium mb-1">Error Loading Products</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-cream-50 relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-terracotta-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                
                <CardContent className="pt-4">
                  <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 my-1">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      {product.discountPrice ? (
                        <>
                          <span className="font-bold">{product.discountPrice}€</span>
                          <span className="text-muted-foreground text-sm line-through ml-2">{product.price}€</span>
                        </>
                      ) : (
                        <span className="font-bold">{product.price}€</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      Category: {product.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2 pt-0">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/artisan/products/${product.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">You haven't added any products yet</p>
              <Button asChild>
                <Link to="/artisan/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Product Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ArtisanLayout>
  );
};

export default ArtisanProductsList;
