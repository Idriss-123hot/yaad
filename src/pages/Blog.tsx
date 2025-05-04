
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogPostCard } from '@/components/ui/BlogPostCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';

const Blog = () => {
  const { posts, loading } = useBlogPosts({ limit: 5 });

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

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

        {loading ? (
          // Loading state
          <section className="py-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="h-96 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-terracotta-600"></div>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {posts.length > 0 && (
              <section className="py-12 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <Link to={`/blog/${posts[0].slug}`} className="block">
                    <div className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={posts[0].featured_image || '/placeholder.svg'} 
                          alt={posts[0].title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-3 py-1 bg-terracotta-100 text-terracotta-600 text-xs font-medium rounded-full">
                            {posts[0].category}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {posts[0].published_at ? 
                              new Date(posts[0].published_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 
                              new Date(posts[0].created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            }
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 group-hover:text-terracotta-600 transition-colors">
                          {posts[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-5">
                          {posts[0].excerpt}
                        </p>
                        <div className="mt-auto">
                          {posts[0].author && (
                            <div className="flex items-center">
                              <img 
                                src={posts[0].author.avatar} 
                                alt={posts[0].author.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium">{posts[0].author.name}</p>
                                <p className="text-sm text-muted-foreground">{posts[0].author.role}</p>
                              </div>
                            </div>
                          )}
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
                {posts.length > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.slice(1).map((post) => (
                      <BlogPostCard 
                        key={post.id} 
                        post={{
                          id: post.id,
                          title: post.title,
                          excerpt: post.excerpt || '',
                          coverImage: post.featured_image || '',
                          category: post.category || '',
                          publishedAt: post.published_at || post.created_at,
                          slug: post.slug,
                          author: post.author || {
                            id: 'unknown',
                            name: 'Admin',
                            role: 'Administrateur',
                            avatar: '/placeholder.svg'
                          },
                          tags: post.tags || []
                        }}
                        className="hover-lift"
                        linkTo={`/blog/${post.slug}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p>Aucun article de blog supplémentaire disponible.</p>
                  </div>
                )}

                {/* Pagination - Simplified for now */}
                <div className="flex justify-center mt-16">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" disabled>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="bg-terracotta-600 text-white hover:bg-terracotta-700">1</Button>
                    <Button variant="outline" size="icon" disabled>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
