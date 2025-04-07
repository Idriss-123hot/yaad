// This is a BlogForm component for creating and editing blog posts
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/supabase-custom';

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères."),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères."),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  featured_image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loadingBlog, setLoadingBlog] = useState(id ? true : false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      featured_image: '',
      tags: [],
      published: false,
    }
  });
  
  // Fetch blog data if editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        setLoadingBlog(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Set form values
          form.setValue('title', data.title);
          form.setValue('slug', data.slug);
          form.setValue('content', data.content);
          form.setValue('excerpt', data.excerpt || '');
          form.setValue('category', data.category || '');
          form.setValue('featured_image', data.featured_image || '');
          form.setValue('tags', data.tags || []);
          form.setValue('published', data.published || false);
          
          // Set image preview
          if (data.featured_image) {
            setImagePreview(data.featured_image);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer l'article de blog.",
          variant: "destructive",
        });
      } finally {
        setLoadingBlog(false);
      }
    };
    
    fetchBlog();
  }, [id, form, toast]);
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const blogData = {
        title: values.title,
        slug: values.slug,
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        featured_image: values.featured_image,
        tags: values.tags,
        published: values.published,
        published_at: values.published ? new Date().toISOString() : null,
        author_id: (await supabase.auth.getUser()).data.user?.id,
      };
      
      let response;
      
      if (id) {
        // Update existing blog post
        response = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', id);
      } else {
        // Create new blog post
        response = await supabase
          .from('blog_posts')
          .insert([blogData]);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: "Succès",
        description: id ? "Article mis à jour avec succès." : "Article créé avec succès.",
      });
      
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article de blog.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add a tag to the tags array
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
    }
    setTagInput('');
  };
  
  // Remove a tag from the tags array
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle image input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('featured_image', url);
    setImagePreview(url);
  };
  
  // Generate a slug from the title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    form.setValue('slug', slug);
  };
  
  if (loadingBlog) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{id ? "Modifier l'article" : "Nouvel article"}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
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
                          onChange={(e) => {
                            field.onChange(e);
                            if (!id && !form.getValues('slug')) {
                              setTimeout(() => generateSlug(), 500);
                            }
                          }}
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
                      <FormLabel>Slug</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="slug-de-article" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={generateSlug}
                          size="sm"
                        >
                          Générer
                        </Button>
                      </div>
                      <FormDescription>
                        L'identifiant unique pour l'URL de l'article
                      </FormDescription>
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
                        <Input placeholder="Catégorie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image à la une</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="URL de l'image" 
                          {...field} 
                          onChange={(e) => handleImageChange(e)}
                        />
                      </FormControl>
                      {imagePreview && (
                        <div className="mt-2">
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="w-full h-40 object-cover rounded"
                            onError={() => setImagePreview(null)}
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Ajouter un tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addTag}
                      size="sm"
                    >
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch('tags')?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-xs ml-1"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extrait</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Bref résumé de l'article" 
                          className="h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Une courte description qui apparaîtra dans les listes d'articles
                      </FormDescription>
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
                          placeholder="Contenu de l'article" 
                          className="h-64" 
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Publier l'article</FormLabel>
                        <FormDescription>
                          L'article sera visible par tous les utilisateurs
                        </FormDescription>
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
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/blog')}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current mr-2"></div>
                    {id ? "Mise à jour..." : "Création..."}
                  </>
                ) : (
                  id ? "Mettre à jour" : "Créer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BlogForm;
