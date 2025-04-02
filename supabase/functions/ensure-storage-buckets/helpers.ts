import { PostgrestSingleResponse } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Creates an RLS policy for a storage bucket
 * @param supabase The Supabase client
 * @param bucketId The ID of the bucket
 * @param policyName The name of the policy
 * @param definition The policy definition (SQL condition)
 * @param action The action (SELECT, INSERT, UPDATE, DELETE)
 * @returns The result of the policy creation
 */
export async function createStoragePolicy(
  supabase: any,
  bucketId: string,
  policyName: string,
  definition: string,
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
): Promise<PostgrestSingleResponse<any>> {
  return await supabase.rpc('create_storage_policy', {
    bucket_id: bucketId,
    policy_name: policyName,
    definition: definition,
    policy_action: action
  });
}

/**
 * Creates a standard set of storage policies for a bucket
 * @param supabase The Supabase client
 * @param bucketId The ID of the bucket
 * @param isPublic Whether the bucket should be publicly readable
 */
export async function createStandardPolicies(
  supabase: any,
  bucketId: string,
  isPublic: boolean
): Promise<void> {
  // Always allow authenticated users to upload files
  await createStoragePolicy(
    supabase,
    bucketId,
    `${bucketId}_auth_insert`,
    `(auth.role() = 'authenticated')`,
    'INSERT'
  );
  
  // Always allow authenticated users to update their own files
  await createStoragePolicy(
    supabase,
    bucketId,
    `${bucketId}_auth_update`,
    `(auth.role() = 'authenticated' AND (bucket_id = '${bucketId}'))`,
    'UPDATE'
  );
  
  // Always allow authenticated users to delete their own files
  await createStoragePolicy(
    supabase,
    bucketId,
    `${bucketId}_auth_delete`,
    `(auth.role() = 'authenticated' AND (bucket_id = '${bucketId}'))`,
    'DELETE'
  );
  
  // If public, allow anyone to read files
  if (isPublic) {
    await createStoragePolicy(
      supabase,
      bucketId,
      `${bucketId}_public_select`,
      'true',
      'SELECT'
    );
  } else {
    // Otherwise, only allow authenticated users to read files
    await createStoragePolicy(
      supabase,
      bucketId,
      `${bucketId}_auth_select`,
      `(auth.role() = 'authenticated')`,
      'SELECT'
    );
  }
}
