
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogPostWithAuthor, parseBlogContent } from '@/models/blogTypes';
import { useToast } from './use-toast';

interface UseBlogPostsOptions {
  limit?: number;
  filterByPublished?: boolean;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { limit = 10, filterByPublished = true } = options;

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (filterByPublished) {
          query = query.eq('published', true);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Add placeholder author data (we'll update this to pull from profiles later)
        const postsWithAuthors: BlogPostWithAuthor[] = data.map(post => ({
          ...post,
          author: {
            id: post.author_id || 'unknown',
            name: 'Admin',
            role: 'Administrateur',
            avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Mohamed-Artisan.jpg'
          }
        }));
        
        setPosts(postsWithAuthors);
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        setError(err.message || 'Failed to fetch blog posts');
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogPosts();
  }, [limit, filterByPublished, toast]);
  
  return { posts, loading, error };
}

export function useBlogPost(slug: string | undefined) {
  const [post, setPost] = useState<BlogPostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    async function fetchBlogPost() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Add placeholder author data (we'll update this to pull from profiles later)
          const postWithAuthor: BlogPostWithAuthor = {
            ...data,
            author: {
              id: data.author_id || 'unknown',
              name: 'Admin',
              role: 'Administrateur',
              avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Mohamed-Artisan.jpg'
            }
          };
          
          setPost(postWithAuthor);
        } else {
          setPost(null);
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBlogPost();
  }, [slug]);
  
  return { post, loading, error };
}
