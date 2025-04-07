
import { Json } from "@/integrations/supabase/types";

// Custom type definitions for tables added but not yet in the types.ts file
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  tags?: string[];
}

export interface ModificationLog {
  id: string;
  old_values?: Json;
  new_values?: Json;
  row_id: string;
  table_name: string;
  user_role?: string;
  user_id?: string;
  modification_date: string;
  status?: string; // Adding status field
}
