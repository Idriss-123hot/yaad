
// Custom types for Supabase specific features

export interface ModificationLog {
  id: string;
  table_name: string;
  row_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  user_id: string | null;
  user_role: string | null;
  status: 'pending' | 'approved' | 'rejected';
  modification_date: string;
}

export interface ArtisanData {
  name?: string;
  profile_photo?: string;
  [key: string]: any;
}

export interface QueryError {
  error: string;
}

export interface ArtisanModificationLog extends ModificationLog {
  changedFields: string[];
  artisanName: string;
  artisans: ArtisanData | null;
}
