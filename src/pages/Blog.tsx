
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogPostCard } from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Définir une interface pour les données de blog
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image: string;
  published_at: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  tags: string[];
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 6;
  const { toast } = useToast();

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Fetch blog posts from Supabase
  const fetchBlogPosts = async (pageNum: number) => {
    try {
      setLoading(true);
      
      const from = (pageNum - 1) * postsPerPage;
      const to = from + postsPerPage - 1;
      
      // Récupérer les articles publiés, triés par date de publication décroissante
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select(`
          id, 
          title, 
          slug, 
          excerpt, 
          category, 
          featured_image,
          published_at,
          content,
          tags,
          author_id,
          profiles:author_id (id, first_name, last_name, role)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transformer les données pour correspondre au format attendu
      const formattedPosts: BlogPost[] = posts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        category: post.category || 'Non classé',
        featured_image: post.featured_image || 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//placeholder-blog.jpg',
        published_at: post.published_at || new Date().toISOString(),
        content: post.content || '',
        tags: post.tags || [],
        author: {
          id: post.profiles?.id || 'anonymous',
          name: post.profiles ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim() : 'Auteur anonyme',
          role: post.profiles?.role || 'Éditeur',
          avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//avatar-placeholder.png'
        }
      }));

      if (pageNum === 1) {
        setBlogPosts(formattedPosts);
      } else {
        setBlogPosts(prev => [...prev, ...formattedPosts]);
      }
      
      // Vérifier s'il y a plus d'articles à charger
      setHasMore(posts.length === postsPerPage);
      
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles de blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(1);
  }, []);

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogPosts(nextPage);
  };

  const showFeaturedPost = blogPosts.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Notre Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos articles sur l'artisanat, les techniques traditionnelles et les histoires inspirantes de nos artisans.
            </p>
          </div>
        </section>

        {loading && page === 1 ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta-600" />
          </div>
        ) : error && blogPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600">Impossible de charger les articles. Veuillez réessayer plus tard.</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600">Aucun article n'est publié pour le moment.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {showFeaturedPost && (
              <section className="py-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <Link to={`/blog/${blogPosts[0].slug}`} className="block">
                    <div className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={blogPosts[0].featured_image} 
                          alt={blogPosts[0].title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-3 py-1 bg-terracotta-100 text-terracotta-600 text-xs font-medium rounded-full">
                            {blogPosts[0].category}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {new Date(blogPosts[0].published_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 group-hover:text-terracotta-600 transition-colors">
                          {blogPosts[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-5">
                          {blogPosts[0].excerpt}
                        </p>
                        <div className="mt-auto">
                          <div className="flex items-center">
                            <img 
                              src={blogPosts[0].author.avatar} 
                              alt={blogPosts[0].author.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">{blogPosts[0].author.name}</p>
                              <p className="text-sm text-muted-foreground">{blogPosts[0].author.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-12 px-6 md:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.slice(1).map((post) => (
                    <BlogPostCard 
                      key={post.id} 
                      post={post} 
                      className="hover-lift"
                      linkTo={`/blog/${post.slug}`}
                    />
                  ))}
                </div>

                {/* Load More / Infinite Scroll */}
                {hasMore && (
                  <div className="flex justify-center mt-16">
                    <Button 
                      onClick={loadMorePosts} 
                      variant="outline" 
                      className="border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>Voir plus d'articles</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
