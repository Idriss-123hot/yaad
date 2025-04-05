
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Image, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';

const ArtisanProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch artisan's products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast({
            title: "Erreur d'authentification",
            description: "Vous devez être connecté pour accéder à cette page",
            variant: "destructive",
          });
          navigate('/artisan/login');
          return;
        }
        
        // First get artisan ID
        const { data: artisanData, error: artisanError } = await supabase
          .from('artisans')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        
        if (artisanError || !artisanData) {
          console.error('Erreur lors de la récupération de l\'ID artisan:', artisanError);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer vos informations d'artisan",
            variant: "destructive",
          });
          return;
        }
        
        // Then fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            categories(*)
          `)
          .eq('artisan_id', artisanData.id)
          .order('created_at', { ascending: false });
        
        if (productsError) {
          console.error('Erreur lors de la récupération des produits:', productsError);
          toast({
            title: "Erreur",
            description: "Impossible de charger vos produits",
            variant: "destructive",
          });
          return;
        }
        
        // Map products data using the utility function from mapDatabaseProductToProduct
        const mappedProducts = productsData.map(product => {
          // Create a properly structured DatabaseProduct object
          const databaseProduct = {
            ...product,
            category: product.categories  // Ensure we use the full category object
          };
          
          return mapDatabaseProductToProduct(databaseProduct);
        });
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des produits",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [navigate, toast]);

  // Delete product
  const handleDelete = async (productId: string) => {
    setDeleting(productId);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      // Update products list
      setProducts(products.filter(product => product.id !== productId));
      
      toast({
        title: "Succès",
        description: "Le produit a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
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
          <h1 className="text-2xl font-bold">Mes Produits</h1>
          <Button onClick={() => navigate('/artisan/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tous les produits</CardTitle>
            <CardDescription>
              Gérez vos produits, modifiez les informations ou ajoutez-en de nouveaux.
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
                <p className="text-muted-foreground">Vous n'avez pas encore de produits</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/artisan/products/new')}
                  className="mt-2"
                >
                  Créer votre premier produit
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
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
                          <div>
                            <Link 
                              to={`/products/${product.id}`} 
                              className="hover:text-terracotta-600 transition-colors"
                            >
                              {product.title}
                            </Link>
                            {product.featured && (
                              <Badge className="ml-2 bg-amber-500">Mis en avant</Badge>
                            )}
                          </div>
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
                            {product.stock > 0 ? product.stock : 'Épuisé'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/artisan/products/${product.id}/edit`)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="text-red-500 hover:text-red-600"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce produit ? 
                                    Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleDelete(product.id)}
                                    disabled={deleting === product.id}
                                  >
                                    {deleting === product.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Supprimer
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
