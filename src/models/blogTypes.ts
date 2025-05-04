
import { Database } from "@/integrations/supabase/types";

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPostWithAuthor extends BlogPost {
  author?: BlogAuthor;
}

// Helper function to convert blog post content to sections if needed
export function parseBlogContent(content: string): any[] {
  try {
    // Try to parse as JSON if it's structured content
    const parsed = JSON.parse(content);
    if (typeof parsed === 'object') {
      // Convert to expected content array format
      return Object.entries(parsed).map(([type, content]) => ({
        type: type === 'introduction' ? 'paragraph' : 
              type === 'body' ? 'paragraph' : 
              type === 'conclusion' ? 'paragraph' : type,
        content
      }));
    }
  } catch (e) {
    // If not parsable as JSON, return as a single paragraph
  }
  
  // Default to returning as single paragraph
  return [{
    type: 'paragraph',
    content
  }];
}
