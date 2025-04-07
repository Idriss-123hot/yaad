
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useDataTable } from '@/hooks/use-data-table';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BlogPost } from '@/types/supabase-custom';

const BlogsList = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const dataTable = useDataTable<BlogPost>({
    data: blogPosts,
    searchFields: ['title', 'excerpt', 'category']
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data as BlogPost[]);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les articles de blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
      
      // Update the local state
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (post: BlogPost) => {
    try {
      const newStatus = !post.published;
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null
        })
        .eq('id', post.id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: newStatus 
          ? "Article publié avec succès" 
          : "Article retiré de la publication",
      });
      
      // Update the local state
      setBlogPosts(prev => prev.map(p => 
        p.id === post.id 
          ? { ...p, published: newStatus, published_at: newStatus ? new Date().toISOString() : null } 
          : p
      ));
    } catch (error: any) {
      console.error('Error updating publish status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de publication",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Articles de Blog</h1>
          <Button onClick={() => navigate('/admin/blog/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un article..."
                value={dataTable.searchQuery}
                onChange={(e) => dataTable.setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ) : dataTable.processedData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun article trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTable.paginatedData.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category || '-'}</TableCell>
                    <TableCell>
                      {format(new Date(post.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.published ? "secondary" : "outline"}
                        className={post.published ? "bg-green-100 text-green-800" : ""}
                      >
                        {post.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => togglePublishStatus(post)}
                        >
                          <Badge 
                            variant={post.published ? "outline" : "secondary"}
                            className={!post.published ? "bg-green-100 text-green-800" : ""}
                          >
                            {post.published ? "Retirer" : "Publier"}
                          </Badge>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteBlogPost(post.id)}
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogsList;
