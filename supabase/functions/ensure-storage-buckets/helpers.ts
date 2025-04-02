
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Creates standard storage policies for a bucket
 * 
 * @param {SupabaseClient} supabase - The Supabase client with admin privileges
 * @param {string} bucketName - The name of the bucket to create policies for
 * @param {boolean} isPublic - Whether the bucket should be publicly accessible
 */
export const createStandardPolicies = async (
  supabase: SupabaseClient,
  bucketName: string,
  isPublic: boolean
) => {
  try {
    console.log(`Setting up policies for bucket ${bucketName}`);
    
    // If the bucket is public, create a policy to allow public access
    if (isPublic) {
      await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: `${bucketName}_public_select`,
        definition: `bucket_id = '${bucketName}'`,
        operation: 'SELECT'
      });
      console.log(`Created public SELECT policy for bucket ${bucketName}`);
    }
    
    // Always create policies for authenticated users
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_insert`,
      definition: `bucket_id = '${bucketName}' AND auth.role() = 'authenticated'`,
      operation: 'INSERT'
    });
    console.log(`Created authenticated INSERT policy for bucket ${bucketName}`);
    
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_update`,
      definition: `bucket_id = '${bucketName}' AND auth.role() = 'authenticated'`,
      operation: 'UPDATE'
    });
    console.log(`Created authenticated UPDATE policy for bucket ${bucketName}`);
    
    await supabase.rpc('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: `${bucketName}_auth_delete`,
      definition: `bucket_id = '${bucketName}' AND auth.role() = 'authenticated'`,
      operation: 'DELETE'
    });
    console.log(`Created authenticated DELETE policy for bucket ${bucketName}`);
    
    console.log(`Successfully set up all policies for bucket ${bucketName}`);
  } catch (error) {
    console.error(`Error creating policies for bucket ${bucketName}:`, error);
  }
};
