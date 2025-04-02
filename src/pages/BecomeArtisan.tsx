
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const BecomeArtisan = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    specialty: '',
    experienceYears: '',
    description: '',
    portfolioUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un envoi de formulaire
    setTimeout(() => {
      toast({
        title: "Demande envoyée",
        description: "Nous avons bien reçu votre candidature et vous contacterons très prochainement.",
      });
      setIsSubmitting(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        specialty: '',
        experienceYears: '',
        description: '',
        portfolioUrl: '',
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Devenez Artisan Partenaire</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rejoignez notre communauté d'artisans et partagez votre savoir-faire avec le monde entier.
              Nous mettons en valeur votre talent et vous aidons à développer votre activité.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">Pourquoi nous rejoindre ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <div className="bg-terracotta-100 text-terracotta-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Visibilité Internationale</h3>
                <p className="text-muted-foreground">
                  Notre plateforme vous permet d'atteindre des clients du monde entier et d'exporter votre savoir-faire marocain.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <div className="bg-terracotta-100 text-terracotta-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Croissance des Ventes</h3>
                <p className="text-muted-foreground">
                  Bénéficiez d'outils marketing puissants et d'une plateforme optimisée pour augmenter vos ventes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm hover-lift">
                <div className="bg-terracotta-100 text-terracotta-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Communauté Solidaire</h3>
                <p className="text-muted-foreground">
                  Rejoignez un réseau d'artisans passionnés et partagez vos expériences dans une communauté bienveillante.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-12 px-6 md:px-12 bg-cream-50">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="font-serif text-2xl font-bold mb-6 text-center">Formulaire de Candidature</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Ville / Région</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Spécialité artisanale</Label>
                    <Select 
                      value={formData.specialty} 
                      onValueChange={(value) => handleSelectChange('specialty', value)}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceramics">Céramique et Poterie</SelectItem>
                        <SelectItem value="textiles">Textiles et Tissage</SelectItem>
                        <SelectItem value="woodworking">Bois et Marqueterie</SelectItem>
                        <SelectItem value="metalwork">Métal et Forge</SelectItem>
                        <SelectItem value="leather">Maroquinerie</SelectItem>
                        <SelectItem value="jewelry">Bijouterie</SelectItem>
                        <SelectItem value="painting">Peinture et Décoration</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">Années d'expérience</Label>
                    <Select 
                      value={formData.experienceYears} 
                      onValueChange={(value) => handleSelectChange('experienceYears', value)}
                    >
                      <SelectTrigger id="experienceYears">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 ans</SelectItem>
                        <SelectItem value="3-5">3-5 ans</SelectItem>
                        <SelectItem value="6-10">6-10 ans</SelectItem>
                        <SelectItem value="11-20">11-20 ans</SelectItem>
                        <SelectItem value="20+">Plus de 20 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Décrivez votre savoir-faire et vos créations</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={4} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">
                    URL de votre portfolio ou réseaux sociaux (optionnel)
                  </Label>
                  <Input 
                    id="portfolioUrl" 
                    name="portfolioUrl" 
                    value={formData.portfolioUrl} 
                    onChange={handleChange} 
                    placeholder="https://" 
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeArtisan;
