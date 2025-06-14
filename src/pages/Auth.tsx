
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Users, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FixedNavMenu } from '@/components/layout/FixedNavMenu';
import { updateLastActivity } from '@/utils/authUtils';
import ForgotPassword from '@/components/auth/ForgotPassword';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          // Update last activity timestamp when logged in
          updateLastActivity();
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
      
      if (data.user && !data.session) {
        toast({
          title: 'Inscription réussie',
          description: 'Veuillez vérifier votre email pour confirmer votre compte.',
          duration: 5000,
        });
      } else {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Erreur d\'inscription',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (showForgotPassword) {
    return (
      <div className="flex flex-col min-h-screen bg-cream-50">
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <Card>
              <CardContent className="pt-6">
                <ForgotPassword 
                  onBack={() => setShowForgotPassword(false)}
                  redirectTo={window.location.origin}
                />
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
        <FixedNavMenu />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>
                    Connectez-vous à votre compte pour accéder à vos commandes et profiter d'une expérience personnalisée.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
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
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto text-sm text-terracotta-600"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Mot de passe oublié ?
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                      disabled={loading}
                    >
                      {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover:text-terracotta-600 w-full"
                    onClick={() => setIsLogin(false)}
                  >
                    Vous n'avez pas de compte ? Inscrivez-vous
                  </Button>
                  
                  <Separator />
                  
                  <div className="flex flex-col w-full space-y-2">
                    <p className="text-sm text-center font-medium">Accès professionnel</p>
                    <div className="flex gap-2 w-full">
                      <Link to="/admin/login" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50"
                        >
                          <Shield size={16} />
                          Admin
                        </Button>
                      </Link>
                      <Link to="/artisan/login" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50"
                        >
                          <Users size={16} />
                          Artisan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>
                    Rejoignez notre communauté pour découvrir des produits artisanaux uniques.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Prénom"
                            className="pl-10"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Nom"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
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
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-terracotta-600 hover:bg-terracotta-700"
                      disabled={loading}
                    >
                      {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    variant="link" 
                    className="text-sm text-muted-foreground hover:text-terracotta-600 w-full"
                    onClick={() => setIsLogin(true)}
                  >
                    Vous avez déjà un compte ? Connectez-vous
                  </Button>
                  
                  <Separator />
                  
                  <div className="flex flex-col w-full space-y-2">
                    <p className="text-sm text-center font-medium">Accès professionnel</p>
                    <div className="flex gap-2 w-full">
                      <Link to="/admin/login" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50"
                        >
                          <Shield size={16} />
                          Admin
                        </Button>
                      </Link>
                      <Link to="/artisan/login" className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 border-terracotta-600 text-terracotta-600 hover:bg-terracotta-50"
                        >
                          <Users size={16} />
                          Artisan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <FixedNavMenu />
    </div>
  );
}
