
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';
import { Map, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  // FAQ items
  const faqItems = [
    {
      question: "Comment puis-je devenir un artisan sur artisanlink ?",
      answer: "Pour devenir un artisan sur notre plateforme, vous devez remplir le formulaire d'inscription disponible dans la section 'Devenir Artisan'. Notre équipe examinera votre candidature et vous contactera dans un délai de 48 heures."
    },
    {
      question: "Quelles sont les commissions appliquées sur les ventes ?",
      answer: "Nous appliquons une commission de 10% sur chaque vente réalisée sur notre plateforme. Cette commission nous permet de maintenir et d'améliorer constamment notre service, tout en assurant une visibilité maximale à votre travail."
    },
    {
      question: "Comment sont gérés les frais d'expédition ?",
      answer: "Les frais d'expédition sont définis par chaque artisan en fonction du poids, des dimensions et de la destination de l'envoi. Vous pouvez consulter ces frais sur la page de chaque produit avant de finaliser votre achat."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient en fonction de l'artisan, du produit (notamment s'il s'agit d'une création sur mesure) et de votre localisation. Un délai estimatif est indiqué sur la page de chaque produit."
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Notre politique de retour varie selon les artisans. Chaque artisan précise ses conditions de retour sur sa page de profil et sur les pages des produits. En général, les produits personnalisés ne sont pas éligibles aux retours."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vous avez des questions ou besoin d'aide ? Notre équipe est là pour vous répondre.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-terracotta-100 p-3 rounded-full mb-4">
                  <Mail className="h-6 w-6 text-terracotta-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Email</h3>
                <p className="text-muted-foreground mb-3">Notre équipe vous répond sous 24h</p>
                <a href="mailto:contact@artisanlink.com" className="text-terracotta-600 hover:underline">
                  contact@artisanlink.com
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-terracotta-100 p-3 rounded-full mb-4">
                  <Phone className="h-6 w-6 text-terracotta-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Téléphone</h3>
                <p className="text-muted-foreground mb-3">Du lundi au vendredi, 9h-18h</p>
                <a href="tel:+33123456789" className="text-terracotta-600 hover:underline">
                  +33 1 23 45 67 89
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-terracotta-100 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-terracotta-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Adresse</h3>
                <p className="text-muted-foreground mb-3">Siège social</p>
                <address className="text-terracotta-600 not-italic">
                  123 Avenue de l'Artisanat<br />
                  75001 Paris, France
                </address>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form and Map */}
        <section className="py-12 px-6 md:px-12 bg-sage-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Votre nom" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="votre.email@exemple.com" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="Sujet de votre message" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Votre message" 
                      rows={5} 
                      className="resize-none" 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  >
                    Envoyer
                  </Button>
                </form>
              </div>
              
              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-sm h-[500px] flex items-center justify-center bg-white">
                <div className="text-center p-6">
                  <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Carte Interactive</h3>
                  <p className="text-muted-foreground mb-4">
                    Intégrez ici une carte Google Maps pour montrer l'emplacement de votre siège social.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pour l'intégration d'une carte interactive, vous devrez ajouter votre clé API Google Maps 
                    ou utiliser une bibliothèque comme Mapbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-10 text-center">Questions Fréquentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
