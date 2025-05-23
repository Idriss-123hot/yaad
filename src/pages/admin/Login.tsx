import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { updateLastActivity, checkAdminRole } from '@/utils/authUtils';
import ForgotPassword from '@/components/auth/ForgotPassword';

/**
 * Schéma de validation du formulaire de connexion
 */
const formSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

/**
 * Composant de la page de connexion pour les administrateurs
 */
export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Configuration du formulaire avec validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Vérifier si l'utilisateur est déjà connecté et est un admin
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        console.log("Checking existing session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Existing session found:", session.user.id);
          updateLastActivity();
          
          // Vérifier le rôle admin
          const isAdmin = await checkAdminRole();
          console.log("Is admin:", isAdmin);
          
          if (isAdmin) {
            console.log("Admin role confirmed, redirecting to dashboard");
            navigate('/admin/dashboard');
          } else {
            console.log("User is logged in but not an admin");
            // Informer l'utilisateur qu'il n'est pas admin
            toast({
              title: 'Accès refusé',
              description: 'Vous n\'avez pas les privilèges administrateur',
              variant: 'destructive',
            });
            
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Erreur de vérification de session:", error);
      }
    };
    
    checkExistingSession();
  }, [navigate, toast]);

  // Mettre en place l'écouteur pour les changements d'état d'authentification
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // N'agir que sur les événements de connexion
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in, checking admin role");
          updateLastActivity();
          
          // Utiliser un setTimeout pour éviter la récursion dans les politiques RLS
          setTimeout(async () => {
            try {
              // Vérifier si l'utilisateur est admin
              const isAdmin = await checkAdminRole();
              console.log("Is admin:", isAdmin);
              
              if (isAdmin) {
                console.log("Admin role confirmed, redirecting to dashboard");
                toast({
                  title: 'Bienvenue',
                  description: 'Vous êtes maintenant connecté en tant qu\'administrateur',
                });
                navigate('/admin/dashboard');
              } else {
                console.log("Not an admin, logging out");
                toast({
                  title: 'Accès refusé',
                  description: 'Vous n\'avez pas les privilèges administrateur',
                  variant: 'destructive',
                });
                
                await supabase.auth.signOut();
              }
            } catch (error) {
              console.error("Error checking admin role:", error);
              setIsLoading(false);
              toast({
                title: 'Erreur de vérification',
                description: 'Une erreur est survenue lors de la vérification de vos droits',
                variant: 'destructive',
              });
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  /**
   * Gère la soumission du formulaire de connexion
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", values.email);
      
      // Tentative de connexion à Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        throw error;
      }
      
      console.log("Login successful, session established:", data?.session?.user?.id);
      // L'écouteur onAuthStateChange se chargera de vérifier le rôle et de rediriger
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Email ou mot de passe invalide',
        variant: 'destructive',
      });
    }
  };

  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ForgotPassword 
                onBack={() => setShowForgotPassword(false)}
                redirectTo={window.location.origin}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-block">
          <Button variant="ghost" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder au tableau de bord administrateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@example.com" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setShowForgotPassword(true)}
                  className="p-0 h-auto text-sm text-terracotta-600"
                >
                  Mot de passe oublié ?
                </Button>
                <Button 
                  type="submit" 
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <p className="text-xs text-center text-muted-foreground w-full">
              Accès réservé aux administrateurs autorisés uniquement
            </p>
            <Link to="/artisan/login" className="w-full">
              <Button 
                variant="link" 
                className="w-full text-sm text-terracotta-600"
              >
                Accéder à l'espace artisan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
