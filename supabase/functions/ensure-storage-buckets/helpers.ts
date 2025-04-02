
// Helper function to create supabase rpc function for storage policies
export const createStoragePolicy = async (
  supabase: any,
  bucketId: string,
  policyName: string,
  definition: string,
  policyAction: string // 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
) => {
  try {
    const { data, error } = await supabase.rpc('admin_create_storage_policy', {
      bucket_id: bucketId,
      policy_name: policyName,
      definition: definition,
      policy_action: policyAction
    });
    
    if (error) {
      console.error(`Error creating ${policyAction} policy for ${bucketId}:`, error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error(`Exception creating ${policyAction} policy for ${bucketId}:`, error);
    return { error };
  }
};
