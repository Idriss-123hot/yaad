
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash } from 'lucide-react';
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

export default function ArtisansList() {
  const [artisans, setArtisans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artisans')
        .select('id, name, location, profile_photo, user_id, joined_date, product_count:products(count)')
        .order('name');

      if (error) throw error;
      
      // Transform data to include product count
      const transformedData = data.map(artisan => ({
        ...artisan,
        product_count: artisan.product_count?.length || 0
      }));
      
      setArtisans(transformedData);
    } catch (error) {
      console.error('Error fetching artisans:', error);
      toast({
        title: 'Error fetching artisans',
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
      // First, get the user_id associated with this artisan
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('user_id')
        .eq('id', deleteId)
        .single();

      if (artisanError) throw artisanError;

      // Delete the artisan
      const { error: deleteError } = await supabase
        .from('artisans')
        .delete()
        .eq('id', deleteId);

      if (deleteError) throw deleteError;

      // Update the user role to 'customer' instead of deleting the user
      const { error: updateUserError } = await supabase
        .from('profiles')
        .update({ role: 'customer' })
        .eq('id', artisanData.user_id);

      if (updateUserError) throw updateUserError;

      toast({
        title: 'Artisan deleted',
        description: 'The artisan has been removed successfully',
      });

      // Refresh artisans list
      fetchArtisans();
    } catch (error) {
      console.error('Error deleting artisan:', error);
      toast({
        title: 'Error deleting artisan',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredArtisans = artisans.filter(
    (artisan) =>
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artisan.location && artisan.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Artisans</h1>
            <p className="text-muted-foreground">
              Manage and create artisan accounts
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/artisans/new')}
            className="bg-terracotta-600 hover:bg-terracotta-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Artisan
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search artisans..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artisan</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Joined</TableHead>
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
              ) : filteredArtisans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? 'No artisans found matching your search'
                      : 'No artisans found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArtisans.map((artisan) => (
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
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(artisan.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the artisan account. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
