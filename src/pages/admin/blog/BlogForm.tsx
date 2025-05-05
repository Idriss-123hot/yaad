
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Define proper type for initialData
interface BlogFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: string;
    category?: string;
    tags?: string[];
    published?: boolean;
  };
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(', ') : '');
  const [published, setPublished] = useState(initialData?.published || false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      if (initialData?.id) {
        // Update existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update(updates)
          .eq('id', initialData.id);

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
    <div className="space-y-4">
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
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="published">Publié</Label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
