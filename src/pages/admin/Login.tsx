

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
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { updateLastActivity, checkAdminRole } from '@/utils/authUtils';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in and is an admin
  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = await checkAdminRole();
      if (isAdmin) {
        navigate('/admin/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      // Check if the user has admin role
      const isAdmin = await checkAdminRole();
      
      if (!isAdmin) {
        await supabase.auth.signOut();
        
        toast({
          title: 'Accès refusé',
          description: 'Vous n\'avez pas les privilèges administrateur',
          variant: 'destructive',
        });
        
        setIsLoading(false);
        return;
      }
      
      // Update last activity timestamp
      updateLastActivity();
      
      toast({
        title: 'Bienvenue',
        description: 'Vous êtes maintenant connecté en tant qu\'administrateur',
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Email ou mot de passe invalide',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
