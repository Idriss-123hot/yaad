
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image: string;
  published_at: string;
  author: Author;
  content: string;
  tags: string[];
}

interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
  linkTo?: string;
}

export function BlogPostCard({ post, className, linkTo }: BlogPostCardProps) {
  const postLink = linkTo || `/blog/${post.slug}`;
  const authorInitials = post.author.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <div 
      className={cn(
        'group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {/* Blog Post Image */}
      <div className="aspect-[16/9] overflow-hidden relative">
        <Link to={postLink}>
          <div className="zoom-image-container">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="zoom-image object-cover"
            />
          </div>
        </Link>
        
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-terracotta-600 text-white text-xs font-medium px-2 py-1 rounded">
          {post.category}
        </span>
      </div>

      {/* Blog Post Info */}
      <div className="p-6">
        <div className="text-sm text-muted-foreground mb-2">
          {new Date(post.published_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <Link to={postLink} className="group-hover:text-terracotta-600 transition-colors">
          <h3 className="font-serif text-xl font-medium mb-3">{post.title}</h3>
        </Link>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center mt-4 pt-4 border-t border-border/50">
          <Avatar className="mr-3">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{post.author.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostCard;
