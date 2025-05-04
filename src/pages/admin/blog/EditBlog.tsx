
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BlogForm from './BlogForm';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (error) throw error;
        setBlogData(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogData();
  }, [id]);
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h2 className="text-red-600 font-medium">Error loading blog post</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
        <BlogForm initialData={blogData} />
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
