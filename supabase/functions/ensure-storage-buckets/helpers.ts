
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Crée des politiques de stockage standard pour un bucket
 * 
 * Cette fonction définit les règles d'accès et de manipulation des fichiers
 * dans un bucket de stockage Supabase donné, avec des permissions différentes
 * selon que le bucket doit être public ou non.
 * 
 * @param {SupabaseClient} supabase - Le client Supabase avec privilèges admin
 * @param {string} bucketName - Le nom du bucket pour lequel créer les politiques
 * @param {boolean} isPublic - Si le bucket doit être accessible publiquement
 */
export const createStandardPolicies = async (
  supabase: SupabaseClient,
  bucketName: string,
  isPublic: boolean
) => {
  try {
    console.log(`Setting up policies for bucket ${bucketName}`);
    
    // Si le bucket est public, créer une politique pour permettre l'accès public
    if (isPublic) {
      await supabase.rpc('create_storage_policy', {
        bucket_name: bucketName,
        policy_name: `${bucketName}_public_select`,
        definition: `bucket_id = '${bucketName}'`,
        operation: 'SELECT'
      });
      console.log(`Created public SELECT policy for bucket ${bucketName}`);
    }
    
    // Toujours créer des politiques pour les utilisateurs authentifiés
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
