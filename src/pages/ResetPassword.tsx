
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';

const formSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Vérifier que le token est présent dans l'URL
  useEffect(() => {
    const checkToken = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const type = params.get('type');
      
      // Vérifier si c'est bien une demande de réinitialisation de mot de passe
      if (type !== 'recovery') {
        setTokenError('Lien de réinitialisation invalide ou expiré');
      }
    };
    
    checkToken();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });
      
      if (error) throw error;
      
      setResetSuccessful(true);
      toast({
        title: 'Réinitialisation réussie',
        description: 'Votre mot de passe a été réinitialisé avec succès',
      });
      
      // Rediriger vers la page de connexion après quelques secondes
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {resetSuccessful ? 'Mot de passe réinitialisé' : 'Réinitialiser votre mot de passe'}
              </CardTitle>
              <CardDescription className="text-center">
                {resetSuccessful 
                  ? 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe'
                  : 'Créez un nouveau mot de passe pour votre compte'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {tokenError ? (
                <div className="text-center space-y-4">
                  <p className="text-destructive">{tokenError}</p>
                  <Button 
                    className="mt-4 bg-terracotta-600 hover:bg-terracotta-700"
                    onClick={() => navigate('/auth')}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              ) : resetSuccessful ? (
                <div className="text-center space-y-4">
                  <p>Votre mot de passe a été réinitialisé avec succès.</p>
                  <p className="text-sm text-muted-foreground">Vous allez être redirigé vers la page de connexion...</p>
                  <Button 
                    className="mt-4 bg-terracotta-600 hover:bg-terracotta-700"
                    onClick={() => navigate('/auth')}
                  >
                    Se connecter maintenant
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="pl-10 pr-10"
                                disabled={isLoading}
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                className="pl-10 pr-10"
                                disabled={isLoading}
                                {...field} 
                              />
                            </div>
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
                          Réinitialisation en cours...
                        </>
                      ) : (
                        'Réinitialiser le mot de passe'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <FixedNavMenu />
    </div>
  );
}
