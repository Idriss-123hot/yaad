
/**
 * En-têtes CORS (Cross-Origin Resource Sharing) pour les fonctions Edge
 * 
 * Ces en-têtes permettent aux fonctions Edge d'être appelées depuis n'importe quel domaine,
 * avec support pour différents types d'authentification et de contenu.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Autorise les requêtes de n'importe quel domaine
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',  // En-têtes autorisés
};
