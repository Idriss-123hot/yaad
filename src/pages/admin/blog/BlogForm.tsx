
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Author interface
interface Author {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
}

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
    published_at?: string;
    author_id?: string;
    profiles?: Author;
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
  const [authorId, setAuthorId] = useState(initialData?.author_id || '');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at 
      ? new Date(initialData.published_at).toISOString().split('T')[0] 
      : ''
  );
  
  const [loading, setLoading] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch authors from Supabase
  useEffect(() => {
    const fetchAuthors = async () => {
      setLoadingAuthors(true);
      try {
        console.log("Fetching authors...");
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['admin', 'artisan']);

        if (error) {
          console.error("Error fetching authors:", error);
          throw error;
        }

        console.log("Authors fetched:", data);
        setAuthors(data || []);
      } catch (error) {
        console.error("Failed to fetch authors:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des auteurs",
          variant: "destructive",
        });
      } finally {
        setLoadingAuthors(false);
      }
    };

    fetchAuthors();
  }, [toast]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  };

  // Auto-generate slug when title changes (only if slug is empty or user hasn't modified it)
  useEffect(() => {
    if (!initialData?.slug || slug === '') {
      setSlug(generateSlug(title));
    }
  }, [title, initialData?.slug, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Submitting blog form...");

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const updates = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        category,
        tags: tagsArray,
        published,
        author_id: authorId || null,
        published_at: published ? (publishedAt || new Date().toISOString()) : null,
      };

      console.log("Blog updates:", updates);

      if (initialData?.id) {
        // Update existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update(updates)
          .eq('id', initialData.id);

        if (error) {
          console.error("Error updating blog post:", error);
          throw error;
        }

        toast({
          title: "Succès",
          description: "Article mis à jour avec succès",
        });
      } else {
        // Create new blog post
        const { error } = await supabase
          .from('blog_posts')
          .insert([updates]);

        if (error) {
          console.error("Error creating blog post:", error);
          throw error;
        }

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

  // Format author display name
  const formatAuthorName = (author: Author) => {
    const name = `${author.first_name || ''} ${author.last_name || ''}`.trim();
    return name ? `${name} (${author.email})` : author.email;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? "Modifier l'article" : "Créer un nouvel article"}</CardTitle>
        <CardDescription>
          Remplissez tous les champs pour {initialData?.id ? "modifier" : "créer"} votre article de blog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
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
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="authorId">Auteur</Label>
              {loadingAuthors ? (
                <div className="flex items-center space-x-2 mt-1 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Chargement des auteurs...</span>
                </div>
              ) : (
                <Select 
                  value={authorId} 
                  onValueChange={setAuthorId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner un auteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Auteurs</SelectLabel>
                      {authors.length === 0 && (
                        <SelectItem value="none" disabled>Aucun auteur disponible</SelectItem>
                      )}
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {formatAuthorName(author)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Un court résumé de l'article qui apparaîtra sur la page du blog.
              </p>
            </div>
            
            <div>
              <Label htmlFor="featuredImage">Image à la une (URL)</Label>
              <Input
                type="url"
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1"
                placeholder="artisanat, tradition, maroc"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked as boolean)}
                />
                <Label htmlFor="published">Publié</Label>
              </div>
              
              {published && (
                <div className="pl-6 mt-2">
                  <Label htmlFor="publishedAt">Date de publication</Label>
                  <Input
                    type="date"
                    id="publishedAt"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {initialData?.id ? "Mise à jour..." : "Création..."}
              </>
            ) : (
              <>{initialData?.id ? "Mettre à jour" : "Créer"} l'article</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;
