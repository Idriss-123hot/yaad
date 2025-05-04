
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Types
interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize and set up auth state listener
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          // We need to fetch profile data after session change
          // Use setTimeout to avoid infinite recursion with RLS policies
          setTimeout(async () => {
            try {
              // Get user profile data
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (profileError) {
                console.error('Error fetching profile:', profileError);
              }
              
              // Set user state with profile data
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                firstName: profileData?.first_name,
                lastName: profileData?.last_name,
                role: profileData?.role,
              });
              
              // Check if there's an intended action in localStorage
              const intendedAction = localStorage.getItem('intended_action');
              if (intendedAction) {
                try {
                  const action = JSON.parse(intendedAction);
                  if (action.type === 'add_to_cart' && action.data) {
                    // We'll handle this in the useCart hook
                  }
                  if (action.type === 'add_to_wishlist' && action.data) {
                    // We'll handle this in the useWishlist hook
                  }
                  // Clear the intended action after processing
                  localStorage.removeItem('intended_action');
                } catch (e) {
                  console.error('Error parsing intended action:', e);
                }
              }
            } catch (error) {
              // If profile fetch failed, still set basic user data
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          try {
            // Get user profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            // Set user state with profile data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              firstName: profileData?.first_name,
              lastName: profileData?.last_name,
              role: profileData?.role,
            });
          } catch (error) {
            // If profile fetch failed, still set basic user data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
            });
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log('Sign in successful:', data);

      // Get user profile to check role
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue sur SaharaMart!',
        });
        
        // Navigate to appropriate dashboard based on role
        if (profileData) {
          if (profileData.role === 'admin') {
            navigate('/admin/dashboard');
            return;
          } else if (profileData.role === 'artisan') {
            navigate('/artisan/dashboard');
            return;
          }
        }
        
        // Default navigation
        navigate('/');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Une erreur est survenue lors de la connexion',
        variant: 'destructive',
      });
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      console.log('Sign up successful:', data);

      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès.',
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      toast({
        title: 'Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt!',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erreur de déconnexion',
        description: error.message || 'Une erreur est survenue lors de la déconnexion',
        variant: 'destructive',
      });
    }
  };

  // Auth context value
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  // Provide auth context
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth context hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
