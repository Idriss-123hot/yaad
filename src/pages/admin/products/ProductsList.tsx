
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
import { Input } from '@/components/ui/input';
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
import { 
  Edit, 
  Trash2, 
  Plus, 
  Image, 
  AlertCircle, 
  Loader2, 
  Search,
  Star,
  StarOff 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProductWithArtisan } from '@/models/types';
import { mapDatabaseProductToProduct } from '@/utils/mapDatabaseModels';
import { debounce } from '@/lib/utils';

const AdminProductsList = () => {
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toggleFeatured, setToggleFeatured] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch all products
  const fetchProducts = async (searchTerm = '') => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          artisan:artisans(*)
        `)
        .order('created_at', { ascending: false });
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Map products data
      const mappedProducts = data.map(product => mapDatabaseProductToProduct(product));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [toast]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((value: string) => {
    fetchProducts(value);
  }, 300);

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

  // Toggle featured status
  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    setToggleFeatured(productId);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentStatus })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      // Update products list
      setProducts(products.map(product => {
        if (product.id === productId) {
          return { ...product, featured: !currentStatus };
        }
        return product;
      }));
      
      toast({
        title: "Succès",
        description: `Le produit a été ${!currentStatus ? 'mis en avant' : 'retiré des produits mis en avant'}`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du produit",
        variant: "destructive",
      });
    } finally {
      setToggleFeatured(null);
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
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Produits</h1>
          <Button onClick={() => navigate('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tous les produits</CardTitle>
            <CardDescription>
              Gérez les produits, modifiez les informations ou ajoutez-en de nouveaux.
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
                  {search ? 'Aucun produit ne correspond à votre recherche' : 'Aucun produit disponible'}
                </p>
                {!search && (
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/admin/products/new')}
                    className="mt-2"
                  >
                    Créer le premier produit
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Artisan</TableHead>
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
                        <TableCell>
                          {product.artisan ? (
                            <Link 
                              to={`/artisan/${product.artisan.id}`}
                              className="hover:text-terracotta-600 transition-colors"
                            >
                              {product.artisan.name}
                            </Link>
                          ) : '—'}
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
                              onClick={() => handleToggleFeatured(product.id, !!product.featured)}
                              title={product.featured ? "Retirer des produits mis en avant" : "Mettre en avant"}
                              disabled={toggleFeatured === product.id}
                              className={product.featured ? "text-amber-500" : ""}
                            >
                              {toggleFeatured === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : product.featured ? (
                                <StarOff className="h-4 w-4" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
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
    </AdminLayout>
  );
};

export default AdminProductsList;
