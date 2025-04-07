
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const BlogsList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de récupérer les articles de blog.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: !currentStatus 
          ? "L'article a été publié." 
          : "L'article a été dépublié.",
      });
      
      fetchBlogPosts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de modifier le statut de publication.",
        variant: 'destructive',
      });
    }
  };

  const deleteBlogPost = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Succès',
        description: "L'article a été supprimé.",
      });
      
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'article.",
        variant: 'destructive',
      });
    }
  };

  const getAuthorName = (profile) => {
    if (!profile) return 'Inconnu';
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile.email;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestion des Articles de Blog</h1>
          <Button
            onClick={() => navigate('/admin/blog/new')}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvel Article
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun article de blog trouvé</p>
            <Button
              onClick={() => navigate('/admin/blog/new')}
              variant="outline"
              className="mt-4"
            >
              Créer votre premier article
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{getAuthorName(post.profiles)}</TableCell>
                    <TableCell>{post.category || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "success" : "secondary"}>
                        {post.published ? 'Publié' : 'Brouillon'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.published_at 
                        ? format(new Date(post.published_at), 'dd/MM/yyyy')
                        : format(new Date(post.created_at), 'dd/MM/yyyy') + ' (créé)'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublishStatus(post.id, post.published)}
                          title={post.published ? "Dépublier" : "Publier"}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBlogPost(post.id)}
                          title="Supprimer"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogsList;
