import { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TeamMemberCard } from '@/components/ui/TeamMemberCard';
import { Flag, Target, Heart, Users, Globe, Lightbulb } from 'lucide-react';

const About = () => {
  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Idriss Laroussi',
      role: 'Fondateur & CEO',
      bio: 'Passionné par l\'artisanat depuis son enfance, Idriss a créé artisanlink pour connecter les artisans du monde entier avec des consommateurs responsables.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Rita Baniyahya',
      role: 'Directrice des Partenariats',
      bio: 'Avec plus de 10 ans d\'expérience dans le commerce équitable, Rita développe des relations durables avec les communautés d\'artisans à travers le monde.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Marie Dupont',
      role: 'Responsable Design',
      bio: 'Diplômée des Arts Décoratifs, Marie veille à ce que notre plateforme mette en valeur le travail des artisans tout en offrant une expérience utilisateur optimale.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Lucas Moreau',
      role: 'Responsable Technique',
      bio: 'Expert en technologies web, Lucas assure le développement et la maintenance de notre plateforme pour garantir une expérience fluide et sécurisée.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80'
    }
  ];

  // Mission items
  const missionItems = [
    {
      icon: <Heart className="h-8 w-8 text-terracotta-600" />,
      title: 'Préserver les savoir-faire',
      description: 'Nous contribuons à la préservation des techniques artisanales traditionnelles en danger de disparition.'
    },
    {
      icon: <Users className="h-8 w-8 text-terracotta-600" />,
      title: 'Soutenir les communautés',
      description: 'Nous créons des opportunités économiques durables pour les artisans et leurs communautés.'
    },
    {
      icon: <Globe className="h-8 w-8 text-terracotta-600" />,
      title: 'Promouvoir l\'équité',
      description: 'Nous assurons une rémunération juste aux artisans et favorisons des pratiques commerciales éthiques.'
    },
    {
      icon: <Target className="h-8 w-8 text-terracotta-600" />,
      title: 'Connecter les cultures',
      description: 'Nous créons des liens entre artisans et consommateurs à travers les frontières culturelles et géographiques.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-terracotta-600" />,
      title: 'Encourager l\'innovation',
      description: 'Nous soutenons l\'innovation dans l\'artisanat tout en respectant les techniques traditionnelles.'
    },
    {
      icon: <Flag className="h-8 w-8 text-terracotta-600" />,
      title: 'Garantir la qualité',
      description: 'Nous sélectionnons avec soin chaque artisan pour garantir un niveau d\'excellence artisanale.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Banner */}
        <section className="bg-cream-50 py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Notre Histoire</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Découvrez qui nous sommes et pourquoi nous avons créé artisanlink.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-serif text-3xl font-bold mb-6">Notre Parcours</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Fondée en 2022, artisanlink est née d'une passion pour l'artisanat authentique et d'une vision 
                    d'un commerce plus équitable. Notre fondatrice, Sophie Martin, a voyagé à travers le monde, 
                    à la rencontre d'artisans talentueux dont les créations exceptionnelles ne trouvaient pas 
                    toujours leur chemin vers un marché international.
                  </p>
                  <p>
                    Face à ce constat, Sophie a imaginé une plateforme qui permettrait de valoriser ces savoir-faire 
                    uniques tout en offrant aux consommateurs l'accès à des produits authentiques, durables et 
                    porteurs d'histoire. L'idée d'artisanlink était née.
                  </p>
                  <p>
                    Aujourd'hui, notre équipe multiculturelle travaille avec passion pour connecter des artisans 
                    du monde entier avec des consommateurs en quête d'authenticité. Nous sommes fiers de contribuer 
                    à la préservation de techniques ancestrales tout en permettant aux artisans de vivre dignement 
                    de leur art.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80" 
                    alt="Artisan travaillant dans son atelier" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 px-6 md:px-12 bg-sage-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-10">Notre Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {missionItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-lg mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-10">Notre Équipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard 
                  key={member.id}
                  member={member}
                  className="hover-lift"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
