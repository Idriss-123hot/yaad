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
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { BlogPost } from '@/models/blogTypes';
import { useNavigate } from 'react-router-dom';
import slugify from '@/utils/slugify';

const blogFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
  featured_image: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  post?: BlogPost;
  onSuccess?: () => void;
}

export function BlogForm({ post, onSuccess }: BlogFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      category: post?.category || '',
      tags: post?.tags ? post.tags.join(', ') : '',
      published: post?.published || false,
      featured_image: post?.featured_image || '',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Auto-generate slug from title if slug field is empty or unchanged
    if (!form.getValues('slug') || form.getValues('slug') === slugify(form.getValues('title'))) {
      form.setValue('slug', slugify(title));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `blog/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const imageUrl = `https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/${filePath}`;
      form.setValue('featured_image', imageUrl);
      
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

  const onSubmit = async (values: BlogFormValues) => {
    try {
      setIsSaving(true);
      
      const blogPostData = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt || null,
        content: values.content,
        category: values.category || null,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : null,
        published: values.published,
        featured_image: values.featured_image || null,
        published_at: values.published ? new Date().toISOString() : null,
      };
      
      let response;
      
      if (post?.id) {
        // Update existing post
        response = await supabase
          .from('blog_posts')
          .update(blogPostData)
          .eq('id', post.id);
      } else {
        // Create new post
        response = await supabase
          .from('blog_posts')
          .insert([blogPostData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: post?.id ? 'Article modifié' : 'Article créé',
        description: post?.id
          ? 'L\'article a été modifié avec succès.'
          : 'L\'article a été créé avec succès.'
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/blog');
      }
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de l\'article.',
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Titre de l'article" 
                      {...field} 
                      onChange={handleTitleChange}
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
                    <Input placeholder="mon-article-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extrait</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Court résumé de l'article" 
                      className="h-20"
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Artisanat, Culture, etc." {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (séparés par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="artisanat, tradition, maroc" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image principale</FormLabel>
                  <div className="space-y-4">
                    {field.value && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={field.value} 
                          alt="Image de l'article" 
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
                          onClick={() => form.setValue('featured_image', '')}
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
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu de l'article..." 
                      className="min-h-[300px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publier</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Rendre cet article visible sur le site
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/blog')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : post?.id ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BlogForm;
