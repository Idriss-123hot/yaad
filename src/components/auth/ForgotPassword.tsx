
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

const formSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

interface ForgotPasswordProps {
  onBack: () => void;
  redirectTo?: string;
}

export default function ForgotPassword({ onBack, redirectTo }: ForgotPasswordProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Configuration d'url pour la redirection après réinitialisation
      const siteUrl = window.location.origin;
      const resetRedirectTo = redirectTo || siteUrl;
      
      console.log('Reset password with redirect to:', `${resetRedirectTo}/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${resetRedirectTo}/reset-password`,
      });
      
      if (error) throw error;
      
      // Afficher un message de succès
      setEmailSent(true);
      toast({
        title: 'Email envoyé',
        description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe',
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        type="button" 
        onClick={onBack} 
        className="p-0"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('back_to_login', 'Retour à la connexion')}
      </Button>
      
      {emailSent ? (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Email envoyé</h2>
          <p>Nous avons envoyé un lien de réinitialisation à votre adresse email.</p>
          <p className="text-sm text-muted-foreground">Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              form.reset();
              setEmailSent(false);
            }}
            className="mt-4"
          >
            Envoyer à une autre adresse
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-xl font-bold">{t('forgot_password', 'Mot de passe oublié ?')}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t('forgot_password_instructions', 'Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe')}
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email', 'Email')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="votre@email.com" 
                          className="pl-10"
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
                    {t('sending', 'Envoi en cours...')}
                  </>
                ) : (
                  t('send_reset_link', 'Envoyer le lien de réinitialisation')
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
