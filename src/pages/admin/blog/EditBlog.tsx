
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogForm from './BlogForm';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      
      try {
        console.log('Fetching blog post with ID:', id);
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles:author_id (id, first_name, last_name, role, email)
          `)
          .eq('id', id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching blog data:', error);
          throw error;
        }
        
        if (!data) {
          setError('Blog post not found');
          toast({
            title: 'Erreur',
            description: "L'article de blog n'a pas été trouvé",
            variant: 'destructive',
          });
          navigate('/admin/blog');
          return;
        }
        
        console.log('Blog post data retrieved:', data);
        setBlogData(data);
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
        toast({
          title: 'Erreur',
          description: "Impossible de charger l'article de blog",
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogData();
  }, [id, navigate, toast]);
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement de l'article...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h2 className="text-red-600 font-medium">Erreur de chargement</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>
        <BlogForm initialData={blogData} />
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
