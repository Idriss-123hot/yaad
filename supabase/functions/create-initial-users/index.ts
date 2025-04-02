
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

/**
 * Création d'un client Supabase avec la clé de service (pour les fonctions admin uniquement)
 */
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Utilisateurs initiaux à créer dans la base de données
 */
const initialUsers = [
  {
    email: 'idriss_123@hotmail.com',
    password: '16091988',
    firstName: 'Idriss',
    lastName: 'Admin',
    role: 'admin',  // Rôle administrateur
  },
  {
    email: 'artisan-yaad@hotmail.com',
    password: '16091988',
    firstName: 'Yaad',
    lastName: 'Artisan',
    role: 'artisan',  // Rôle artisan
  },
];

/**
 * Fonction Edge pour créer les utilisateurs initiaux
 * 
 * Cette fonction crée des utilisateurs prédéfinis avec des rôles spécifiques
 * pour faciliter le démarrage de l'application.
 */
Deno.serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérification de l'autorisation (dans une vraie app, vous ajouteriez plus de sécurité ici)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Suivi des utilisateurs créés
    const results = [];
    
    for (const user of initialUsers) {
      // Vérifier si l'utilisateur existe déjà pour éviter les erreurs de doublon
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', user.email);
      
      if (existingUsers && existingUsers.length > 0) {
        results.push({ email: user.email, status: 'skipped', message: 'User already exists' });
        continue;
      }
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
        },
        email_confirm: true,  // Confirmer automatiquement l'e-mail
      });
      
      if (authError) {
        results.push({ email: user.email, status: 'error', message: authError.message });
        continue;
      }
      
      // Mettre à jour le rôle de l'utilisateur dans la table profiles
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: user.role })
          .eq('id', authData.user.id);
        
        if (updateError) {
          results.push({ 
            email: user.email, 
            status: 'partial', 
            message: `User created but role update failed: ${updateError.message}` 
          });
          continue;
        }
        
        // Si l'utilisateur est un artisan, créer un profil d'artisan
        if (user.role === 'artisan') {
          const { error: artisanError } = await supabase
            .from('artisans')
            .insert({
              user_id: authData.user.id,
              name: `${user.firstName} ${user.lastName}`,
              bio: 'Artisan crafting high-quality products',
              location: 'France',
              joined_date: new Date().toISOString(),
            });
            
          if (artisanError) {
            results.push({ 
              email: user.email, 
              status: 'partial', 
              message: `User created, role updated, but artisan profile creation failed: ${artisanError.message}` 
            });
            continue;
          }
        }
        
        results.push({ email: user.email, status: 'success', userId: authData.user.id });
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Initial user setup completed',
      results, 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating initial users:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
