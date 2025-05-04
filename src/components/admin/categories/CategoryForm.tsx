import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '@/hooks/useCategories';
import slugify from '@/utils/slugify';

const categoryFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image: category?.image || '',
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    
    // Auto-generate slug from name if slug field is empty or unchanged
    if (!form.getValues('slug') || form.getValues('slug') === slugify(form.getValues('name'))) {
      form.setValue('slug', slugify(name));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `categories/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const imageUrl = `https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/${filePath}`;
      form.setValue('image', imageUrl);
      
      toast({
        title: 'Image téléchargée',
        description: 'L\'image a été téléchargée avec succès.'
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du téléchargement de l\'image.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsSaving(true);
      
      const categoryData = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        image: values.image || null,
      };
      
      let response;
      
      if (category?.id) {
        // Update existing category
        response = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id);
      } else {
        // Create new category
        response = await supabase
          .from('categories')
          .insert([categoryData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: category?.id ? 'Catégorie modifiée' : 'Catégorie créée',
        description: category?.id
          ? 'La catégorie a été modifiée avec succès.'
          : 'La catégorie a été créée avec succès.'
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/categories');
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de la catégorie.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom de la catégorie" 
                      {...field} 
                      onChange={handleNameChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="ma-categorie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la catégorie" 
                      className="h-32"
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <div className="space-y-4">
                    {field.value && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={field.value} 
                          alt="Image de la catégorie" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center">
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline"
                          disabled={isUploading}
                          className="mr-4"
                          asChild
                        >
                          <label>
                            {isUploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Téléchargement...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Télécharger une image
                              </>
                            )}
                            <input 
                              type="file" 
                              onChange={handleImageUpload}
                              accept="image/*" 
                              className="sr-only"
                            />
                          </label>
                        </Button>
                      </div>
                      {field.value && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => form.setValue('image', '')}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/categories')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : category?.id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CategoryForm;
