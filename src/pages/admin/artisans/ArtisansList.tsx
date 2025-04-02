import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDataTable } from '@/hooks/use-data-table';
import { SearchAndFilter } from '@/components/ui/data-table/search-and-filter';
import { DataTablePagination } from '@/components/ui/data-table/pagination';

export default function ArtisansList() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchArtisans();
    
    const ensureStorageBuckets = async () => {
      try {
        const { error } = await supabase.functions.invoke('ensure-storage-buckets');
        if (error) {
          console.error('Error ensuring storage buckets:', error);
        }
      } catch (error) {
        console.error('Error invoking ensure-storage-buckets function:', error);
      }
    };
    
    ensureStorageBuckets();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artisans')
        .select('id, name, location, profile_photo, user_id, joined_date, product_count:products(count)')
        .order('name');

      if (error) throw error;
      
      const transformedData = data.map(artisan => ({
        ...artisan,
        product_count: artisan.product_count?.length || 0
      }));
      
      setArtisans(transformedData);
    } catch (error) {
      console.error('Error fetching artisans:', error);
      toast({
        title: 'Erreur lors du chargement des artisans',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('user_id')
        .eq('id', deleteId)
        .single();

      if (artisanError) throw artisanError;

      const { error: deleteError } = await supabase
        .from('artisans')
        .delete()
        .eq('id', deleteId);

      if (deleteError) throw deleteError;

      const { error: updateUserError } = await supabase
        .from('profiles')
        .update({ role: 'customer' })
        .eq('id', artisanData.user_id);

      if (updateUserError) throw updateUserError;

      toast({
        title: 'Artisan supprimé',
        description: 'Le compte de l\'artisan a été supprimé avec succès',
      });

      fetchArtisans();
    } catch (error) {
      console.error('Error deleting artisan:', error);
      toast({
        title: 'Erreur lors de la suppression de l\'artisan',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filterOptions = [
    {
      id: 'location',
      label: 'Emplacement'
    },
    {
      id: 'product_count',
      label: 'Nombre de produits'
    }
  ];

  const {
    paginatedData,
    searchQuery,
    setSearchQuery,
    sortConfig,
    requestSort,
    currentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    filters,
    setFilters
  } = useDataTable({
    data: artisans,
    searchFields: ['name', 'location']
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Artisans</h1>
            <p className="text-muted-foreground">
              Gérer et créer des comptes d'artisans
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/artisans/new')}
            className="bg-terracotta-600 hover:bg-terracotta-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Artisan
          </Button>
        </div>

        <SearchAndFilter
          searchPlaceholder="Rechercher des artisans..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          filterOptions={filterOptions}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className={sortConfig?.key === 'name' ? 'cursor-pointer bg-muted/50' : 'cursor-pointer'}
                  onClick={() => requestSort('name')}
                >
                  Artisan {sortConfig?.key === 'name' && (sortConfig?.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={sortConfig?.key === 'location' ? 'cursor-pointer bg-muted/50' : 'cursor-pointer'}
                  onClick={() => requestSort('location')}
                >
                  Emplacement {sortConfig?.key === 'location' && (sortConfig?.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={sortConfig?.key === 'product_count' ? 'cursor-pointer bg-muted/50' : 'cursor-pointer'}
                  onClick={() => requestSort('product_count')}
                >
                  Produits {sortConfig?.key === 'product_count' && (sortConfig?.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={sortConfig?.key === 'joined_date' ? 'cursor-pointer bg-muted/50' : 'cursor-pointer'}
                  onClick={() => requestSort('joined_date')}
                >
                  Inscrit le {sortConfig?.key === 'joined_date' && (sortConfig?.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery || Object.values(filters).some(Boolean)
                      ? 'Aucun artisan correspondant à votre recherche'
                      : 'Aucun artisan trouvé'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((artisan) => (
                  <TableRow key={artisan.id}>
                    <TableCell className="flex items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                          {artisan.profile_photo ? (
                            <img
                              src={artisan.profile_photo}
                              alt={artisan.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-terracotta-100 text-terracotta-800">
                              {artisan.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{artisan.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{artisan.location || 'N/A'}</TableCell>
                    <TableCell>{artisan.product_count}</TableCell>
                    <TableCell>
                      {new Date(artisan.joined_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/admin/artisans/${artisan.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(artisan.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={artisans.length}
        />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera définitivement le compte de l'artisan. Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
