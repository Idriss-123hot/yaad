
/**
 * Partage des types pour les fonctions Edge
 * 
 * Exporte les types de la base de données pour maintenir la cohérence
 * des types entre le frontend et les fonctions Edge.
 */
export type { Database } from '../../../src/integrations/supabase/types';
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
