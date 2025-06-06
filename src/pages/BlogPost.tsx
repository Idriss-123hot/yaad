import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SAMPLE_BLOG_POSTS } from '@/models/blog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
const BlogPost = () => {
  const {
    slug
  } = useParams();
  const navigate = useNavigate();

  // Find the post with the matching slug
  const post = SAMPLE_BLOG_POSTS.find(post => post.slug === slug);

  // Redirect to 404 if post not found
  useEffect(() => {
    if (!post) {
      navigate('/not-found', {
        replace: true
      });
    }
  }, [post, navigate]);

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // If post not found and not yet redirected
  if (!post) {
    return null;
  }
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Post Header */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-terracotta-600 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Retour aux articles</span>
            </Link>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-terracotta-100 text-terracotta-600 text-xs font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-muted-foreground text-sm">
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center">
              <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Post Cover Image */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="aspect-[16/9] overflow-hidden rounded-xl">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Post Content */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-stone mx-auto">
              {post.content.map((section, index) => <div key={index} className="mb-8">
                  {section.type === 'paragraph' && <p>{section.content}</p>}
                  {section.type === 'heading' && <h2 className="font-serif font-bold text-2xl mt-8 mb-4">{section.content}</h2>}
                  {section.type === 'image' && <figure className="my-8">
                      <img src={section.url} alt={section.caption} className="rounded-lg w-full object-fill" />
                      {section.caption && <figcaption className="text-center text-muted-foreground mt-2">{section.caption}</figcaption>}
                    </figure>}
                  {section.type === 'quote' && <blockquote className="border-l-4 border-terracotta-300 pl-4 italic my-6">
                      {section.content}
                      {section.author && <cite className="block text-right mt-2 not-italic">— {section.author}</cite>}
                    </blockquote>}
                </div>)}
            </div>

            {/* Share and Tags */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="font-medium mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => <span key={index} className="px-3 py-1 bg-sage-100 text-sage-700 text-xs rounded-full">
                        {tag}
                      </span>)}
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Partager:</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Facebook</Button>
                    <Button variant="outline" size="sm">Twitter</Button>
                    <Button variant="outline" size="sm">LinkedIn</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 px-6 md:px-12 bg-cream-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-8 text-center">Articles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SAMPLE_BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3).map(relatedPost => <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={relatedPost.coverImage} alt={relatedPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-muted-foreground block mb-2">
                        {new Date(relatedPost.publishedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                      </span>
                      <h3 className="font-serif font-medium text-lg mb-2 group-hover:text-terracotta-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default BlogPost;