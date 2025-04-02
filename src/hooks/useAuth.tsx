
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
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
      async (event, session) => {
        if (session && session.user) {
          try {
            // Get user profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
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
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur SaharaMart!',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
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

      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès.',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur d\'inscription',
        description: error.message,
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
        description: error.message,
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
