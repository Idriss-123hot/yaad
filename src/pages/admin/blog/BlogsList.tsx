
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  PlusCircle, 
  Trash2, 
  Eye, 
  Search,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/models/blogTypes';

const BlogsList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les articles de blog',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const newPublishedState = !post.published;
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: newPublishedState,
          published_at: newPublishedState ? new Date().toISOString() : post.published_at
        })
        .eq('id', post.id);
      
      if (error) throw error;
      
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: newPublishedState } : p));
      toast({
        title: newPublishedState ? 'Article publié' : 'Article dépublié',
        description: newPublishedState 
          ? 'L\'article est maintenant visible sur le site'
          : 'L\'article n\'est plus visible sur le site',
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de l\'article',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestion du Blog</h1>
            <p className="text-muted-foreground">Créer et gérer les articles du blog</p>
          </div>
          <Button asChild>
            <Link to="/admin/blog/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvel Article
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Publié le</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-md truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>{post.category || '-'}</TableCell>
                      <TableCell>
                        {post.published_at 
                          ? new Date(post.published_at).toLocaleDateString('fr-FR')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant={post.published ? "default" : "outline"}
                          size="sm"
                          className={post.published ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleTogglePublished(post)}
                        >
                          {post.published ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Publié
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Brouillon
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogsList;
