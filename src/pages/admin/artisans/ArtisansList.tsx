
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
  AlertCircle, 
  Loader2, 
  Search,
  Star,
  StarOff,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Artisan } from '@/models/types';
import { mapDatabaseArtisanToArtisan } from '@/utils/mapDatabaseModels';
import { debounce } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminArtisansList = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toggleFeatured, setToggleFeatured] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch all artisans
  const fetchArtisans = async (searchTerm = '') => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('artisans')
        .select('*')
        .order('name');
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Map artisans data
      const mappedArtisans = data.map(artisan => mapDatabaseArtisanToArtisan(artisan));
      
      // Fetch product counts for each artisan
      const artisanIds = mappedArtisans.map(artisan => artisan.id);
      
      if (artisanIds.length > 0) {
        // For each artisan, count their products
        const productCountPromises = artisanIds.map(async (artisanId) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('artisan_id', artisanId);
          
          return { artisanId, count: count || 0 };
        });
        
        const productCounts = await Promise.all(productCountPromises);
        
        // Update artisans with product counts
        mappedArtisans.forEach(artisan => {
          const countObj = productCounts.find(pc => pc.artisanId === artisan.id);
          artisan.productCount = countObj ? countObj.count : 0;
        });
      }
      
      setArtisans(mappedArtisans);
    } catch (error) {
      console.error('Erreur lors de la récupération des artisans:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les artisans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, [toast]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((value: string) => {
    fetchArtisans(value);
  }, 300);

  // Delete artisan
  const handleDelete = async (artisanId: string) => {
    setDeleting(artisanId);
    
    try {
      // Get user_id for the artisan
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('user_id')
        .eq('id', artisanId)
        .single();
      
      if (artisanError || !artisanData) {
        throw new Error('Artisan not found');
      }
      
      // Delete the artisan
      const { error } = await supabase
        .from('artisans')
        .delete()
        .eq('id', artisanId);
      
      if (error) {
        throw error;
      }
      
      // Update artisans list
      setArtisans(artisans.filter(artisan => artisan.id !== artisanId));
      
      toast({
        title: "Succès",
        description: "L'artisan a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'artisan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'artisan",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (artisanId: string, currentStatus: boolean) => {
    setToggleFeatured(artisanId);
    
    try {
      const { error } = await supabase
        .from('artisans')
        .update({ featured: !currentStatus })
        .eq('id', artisanId);
      
      if (error) {
        throw error;
      }
      
      // Update artisans list
      setArtisans(artisans.map(artisan => {
        if (artisan.id === artisanId) {
          return { ...artisan, featured: !currentStatus };
        }
        return artisan;
      }));
      
      toast({
        title: "Succès",
        description: `L'artisan a été ${!currentStatus ? 'mis en avant' : 'retiré des artisans mis en avant'}`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'artisan",
        variant: "destructive",
      });
    } finally {
      setToggleFeatured(null);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return format(date, 'PPP', { locale: fr });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Artisans</h1>
          <Button onClick={() => navigate('/admin/artisans/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Artisan
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un artisan..."
                className="pl-10"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tous les artisans</CardTitle>
            <CardDescription>
              Gérez les artisans, modifiez leurs informations ou ajoutez-en de nouveaux.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
              </div>
            ) : artisans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  {search ? 'Aucun artisan ne correspond à votre recherche' : 'Aucun artisan disponible'}
                </p>
                {!search && (
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/admin/artisans/new')}
                    className="mt-2"
                  >
                    Créer le premier artisan
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Photo</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead className="text-center">Produits</TableHead>
                      <TableHead className="text-center">Évaluation</TableHead>
                      <TableHead>Depuis</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artisans.map((artisan) => (
                      <TableRow key={artisan.id}>
                        <TableCell>
                          {artisan.profileImage ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border">
                              <img 
                                src={artisan.profileImage} 
                                alt={artisan.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <Link 
                              to={`/artisan/${artisan.id}`} 
                              className="hover:text-terracotta-600 transition-colors"
                            >
                              {artisan.name}
                            </Link>
                            {artisan.featured && (
                              <Badge className="ml-2 bg-amber-500">Mis en avant</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{artisan.location || '—'}</TableCell>
                        <TableCell className="text-center">{artisan.productCount}</TableCell>
                        <TableCell className="text-center">
                          {artisan.rating > 0 ? (
                            <div className="flex items-center justify-center">
                              <span className="font-medium">{artisan.rating.toFixed(1)}</span>
                              <Star className="h-4 w-4 text-amber-500 ml-1" />
                              <span className="text-xs text-muted-foreground ml-1">
                                ({artisan.reviewCount})
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Pas d'avis</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(artisan.joinedDate)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleToggleFeatured(artisan.id, !!artisan.featured)}
                              title={artisan.featured ? "Retirer des artisans mis en avant" : "Mettre en avant"}
                              disabled={toggleFeatured === artisan.id}
                              className={artisan.featured ? "text-amber-500" : ""}
                            >
                              {toggleFeatured === artisan.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : artisan.featured ? (
                                <StarOff className="h-4 w-4" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/admin/artisans/${artisan.id}/edit`)}
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
                                    Êtes-vous sûr de vouloir supprimer cet artisan ? 
                                    Cette action est irréversible et supprimera également tous ses produits.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-600"
                                    onClick={() => handleDelete(artisan.id)}
                                    disabled={deleting === artisan.id}
                                  >
                                    {deleting === artisan.id ? (
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

export default AdminArtisansList;
