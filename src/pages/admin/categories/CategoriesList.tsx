
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Save, X, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  created_at: string;
}

const AdminCategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Category>>({});
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [newCategoryValues, setNewCategoryValues] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditValues({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleEditChange = (field: string, value: string) => {
    setEditValues({
      ...editValues,
      [field]: value
    });
  };

  const handleNewCategoryChange = (field: string, value: string) => {
    setNewCategoryValues({
      ...newCategoryValues,
      [field]: value
    });
    
    // Auto-generate slug from name if slug field is empty
    if (field === 'name' && !newCategoryValues.slug) {
      setNewCategoryValues({
        ...newCategoryValues,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      });
    }
  };

  const saveChanges = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(editValues)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Catégorie mise à jour avec succès',
      });

      // Update the local state to reflect changes
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, ...editValues } : cat
      ));
      setEditingId(null);
      setEditValues({});
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la catégorie: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const addNewCategory = async () => {
    if (!newCategoryValues.name || !newCategoryValues.slug) {
      toast({
        title: 'Erreur',
        description: 'Le nom et le slug sont requis',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryValues.name,
          slug: newCategoryValues.slug,
          description: newCategoryValues.description || null,
          image: newCategoryValues.image || null
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Nouvelle catégorie ajoutée avec succès',
      });

      // Add the new category to the local state
      if (data && data.length > 0) {
        setCategories([...categories, data[0]]);
      }
      
      // Reset form
      setNewCategory(false);
      setNewCategoryValues({
        name: '',
        slug: '',
        description: '',
        image: ''
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la catégorie: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Catégorie supprimée avec succès',
      });

      // Remove the category from the local state
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la catégorie: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
          <Button 
            onClick={() => setNewCategory(true)} 
            disabled={newCategory}
            className="bg-terracotta-600 hover:bg-terracotta-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
          </div>
        ) : (
          <>
            {newCategory && (
              <div className="bg-muted/30 p-4 rounded-md mb-6 border">
                <h2 className="text-lg font-medium mb-4">Nouvelle Catégorie</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom *</label>
                    <Input
                      value={newCategoryValues.name || ''}
                      onChange={(e) => handleNewCategoryChange('name', e.target.value)}
                      placeholder="Nom de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug *</label>
                    <Input
                      value={newCategoryValues.slug || ''}
                      onChange={(e) => handleNewCategoryChange('slug', e.target.value)}
                      placeholder="slug-de-la-categorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      value={newCategoryValues.description || ''}
                      onChange={(e) => handleNewCategoryChange('description', e.target.value)}
                      placeholder="Description de la catégorie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de l'image</label>
                    <Input
                      value={newCategoryValues.image || ''}
                      onChange={(e) => handleNewCategoryChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setNewCategory(false)}>
                    Annuler
                  </Button>
                  <Button onClick={addNewCategory}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Aucune catégorie trouvée.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          {editingId === category.id ? (
                            <Input 
                              value={editValues.name || ''} 
                              onChange={(e) => handleEditChange('name', e.target.value)}
                            />
                          ) : (
                            category.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === category.id ? (
                            <Input 
                              value={editValues.slug || ''} 
                              onChange={(e) => handleEditChange('slug', e.target.value)}
                            />
                          ) : (
                            category.slug
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === category.id ? (
                            <Input 
                              value={editValues.description || ''} 
                              onChange={(e) => handleEditChange('description', e.target.value)}
                            />
                          ) : (
                            category.description || '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === category.id ? (
                            <Input 
                              value={editValues.image || ''} 
                              onChange={(e) => handleEditChange('image', e.target.value)}
                            />
                          ) : (
                            <div className="flex items-center">
                              {category.image && (
                                <div className="w-10 h-10 mr-2 rounded overflow-hidden">
                                  <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";
                                    }}
                                  />
                                </div>
                              )}
                              <span className={cn(category.image ? "" : "text-muted-foreground")}>
                                {category.image ? "Image" : "Aucune image"}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === category.id ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={cancelEditing}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => saveChanges(category.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => startEditing(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => deleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesList;
