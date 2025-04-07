
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/supabase-custom';

const BlogForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    featured_image: '',
    tags: [] as string[],
    published: false
  });
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (isEditing) {
      fetchBlogPost();
    }
  }, [id]);
  
  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const blogPost = data as unknown as BlogPost;
        setFormData({
          title: blogPost.title || '',
          slug: blogPost.slug || '',
          content: blogPost.content || '',
          excerpt: blogPost.excerpt || '',
          category: blogPost.category || '',
          featured_image: blogPost.featured_image || '',
          tags: blogPost.tags || [],
          published: blogPost.published || false
        });
        
        if (blogPost.featured_image) {
          setImagePreview(blogPost.featured_image);
        }
      }
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de récupérer l'article de blog.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Auto-generate slug from title if slug is empty
    if (name === 'title' && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, published: checked }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const uploadImage = async () => {
    if (!imageFile) return formData.featured_image;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de télécharger l'image.",
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: 'Erreur',
        description: "Le titre et le contenu sont obligatoires.",
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload image if there's a new one
      let imageUrl = formData.featured_image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) return; // Exit if image upload failed
      }
      
      const { data: session } = await supabase.auth.getSession();
      const currentUser = session?.session?.user?.id;
      
      const blogData = {
        ...formData,
        featured_image: imageUrl,
        published_at: formData.published ? new Date().toISOString() : null,
        author_id: currentUser
      };
      
      let result;
      
      if (isEditing) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([blogData])
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      toast({
        title: 'Succès',
        description: isEditing
          ? "L'article a été mis à jour."
          : "L'article a été créé."
      });
      
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'enregistrer l'article de blog.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditing) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/blog')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  L'identifiant URL unique pour cet article 
                  (ex: mon-article-de-blog)
                </p>
              </div>
              
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Un court résumé qui sera affiché dans les listes d'articles
                </p>
              </div>
              
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ajouter un tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleTagAdd}
                    variant="outline"
                  >
                    Ajouter
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex gap-1 items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-1 text-xs font-bold"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="published">
                  Publier cet article immédiatement
                </Label>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <Label htmlFor="featured_image">Image principale</Label>
                <div className="mt-1 flex items-center">
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-8 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto max-h-48 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center mb-4">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <span className="mt-2 block text-sm font-medium">
                        {imagePreview ? "Changer l'image" : "Ajouter une image"}
                      </span>
                    </div>
                    <Input
                      id="featured_image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="min-h-[300px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/blog')}
              className="mr-2"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-current"></div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Mettre à jour" : "Publier"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BlogForm;
