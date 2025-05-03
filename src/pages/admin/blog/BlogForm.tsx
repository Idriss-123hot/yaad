import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BlogPost } from '@/types/supabase-custom';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setSlug(data.slug);
      setContent(data.content);
      setExcerpt(data.excerpt || '');
      setFeaturedImage(data.featured_image || '');
      setCategory(data.category || '');
      setTags(data.tags ? data.tags.join(', ') : '');
      setPublished(data.published);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer l'article de blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const tagsArray = tags.split(',').map(tag => tag.trim());

      const updates = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        category,
        tags: tagsArray,
        published,
      };

      if (id) {
        // Update existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update(updates)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Article mis à jour avec succès",
        });
      } else {
        // Create new blog post
        const { error } = await supabase
          .from('blog_posts')
          .insert([
            {
              ...updates,
              author_id: 'user-id', // Replace with actual user ID
            }
          ]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Article créé avec succès",
        });
      }

      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error creating/updating blog post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer/mettre à jour l'article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{id ? 'Modifier' : 'Nouvel'} Article</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Modifier l\'article' : 'Créer un article'}</CardTitle>
            <CardDescription>
              {id ? 'Modifiez les détails de votre article.' : 'Ajoutez un nouvel article à votre blog.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="featuredImage">Image à la une</Label>
                <Input
                  type="text"
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="published">Publié</Label>
                <Input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
              </div>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BlogForm;
