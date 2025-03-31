import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../_shared/cors.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

// Create a Supabase client with the service role key (only for admin functions)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initial users to create
const initialUsers = [
  {
    email: 'idriss_123@hotmail.com',
    password: '16091988',
    firstName: 'Idriss',
    lastName: 'Admin',
    role: 'admin',
  },
  {
    email: 'artisan-yaad@hotmail.com',
    password: '16091988',
    firstName: 'Yaad',
    lastName: 'Artisan',
    role: 'artisan',
  },
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if request is authorized (in a real app, you'd add more security here)
    // This is a sensitive endpoint, so we'll check for an admin authorization token
    // For demonstration, we're using a simple authorization check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // In a real app, validate the token properly
    // For this demo, we'll create the users without further checks
    
    // Keep track of created users
    const results = [];
    
    for (const user of initialUsers) {
      // Check if user already exists to avoid duplicate errors
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', user.email);
      
      if (existingUsers && existingUsers.length > 0) {
        results.push({ email: user.email, status: 'skipped', message: 'User already exists' });
        continue;
      }
      
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
        },
        email_confirm: true, // Auto-confirm the email
      });
      
      if (authError) {
        results.push({ email: user.email, status: 'error', message: authError.message });
        continue;
      }
      
      // Update the user's role in the profiles table
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
        
        // If the user is an artisan, create an artisan profile
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
