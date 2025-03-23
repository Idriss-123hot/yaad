
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPostSection {
  type: 'paragraph' | 'heading' | 'image' | 'quote';
  content?: string;
  url?: string;
  caption?: string;
  author?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  content: BlogPostSection[];
}

// Sample authors
const authors = {
  idriss: {
    id: 'author-1',
    name: 'Idriss Laroussi',
    role: 'Fondateur & CEO',
    avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//IMG-20220204-WA0026.jpg'
  },
  rita: {
    id: 'author-2',
    name: 'Rita Baniyahya',
    role: 'Directrice des Partenariats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'
  },
  marie: {
    id: 'author-3',
    name: 'Marie Dupont',
    role: 'Responsable Design',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
  }
};

// Sample blog posts
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Le renouveau de l\'artisanat traditionnel marocain à l\'ère du digital',
    slug: 'renouveau-artisanat-marocain-digital',
    excerpt: 'Comment les artisans marocains adaptent leurs savoir-faire ancestraux aux technologies modernes pour conquérir de nouveaux marchés.',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Transformation-digitale%20artisans.jpeg',
    category: 'Artisanat & Technologie',
    tags: ['Maroc', 'Artisanat', 'E-commerce', 'Tradition'],
    author: authors.idriss,
    publishedAt: '2023-10-15',
    content: [
      {
        type: 'paragraph',
        content: 'Au cœur des médinas de Fès, Marrakech ou Essaouira, le martèlement rythmé des artisans du cuivre, les métiers à tisser des femmes berbères ou les tours des potiers tournent depuis des siècles. Ces techniques ancestrales, transmises de génération en génération, constituent un patrimoine culturel inestimable pour le Maroc.'
      },
      {
        type: 'paragraph',
        content: 'Pourtant, face à la mondialisation et à l\'industrialisation, cet artisanat traditionnel a longtemps été menacé. Comment maintenir vivantes ces pratiques dans un monde où la production de masse domine ? Comment assurer aux artisans un revenu digne de leur talent et de leur expertise ?'
      },
      {
        type: 'heading',
        content: 'La révolution digitale au service de l\'artisanat'
      },
      {
        type: 'paragraph',
        content: 'La réponse pourrait bien se trouver dans la révolution numérique. Loin d\'être incompatibles, tradition et technologie se révèlent être des alliées précieuses pour ces gardiens du patrimoine marocain.'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1596636478939-6bf18cafa28f?auto=format&fit=crop&q=80',
        caption: 'Artisan marocain travaillant le cuir dans son atelier de la médina de Fès'
      },
      {
        type: 'paragraph',
        content: 'Les plateformes de commerce en ligne offrent désormais aux artisans la possibilité de s\'affranchir des intermédiaires et d\'accéder directement à une clientèle internationale. Des coopératives de femmes tisserandes du Moyen Atlas aux céramistes de Safi, nombreux sont ceux qui ont saisi cette opportunité.'
      },
      {
        type: 'quote',
        content: 'Internet nous a ouvert les portes du monde. Autrefois, nous dépendions entièrement des commerçants de la médina ou des grossistes. Aujourd\'hui, je peux vendre mes créations à des clients du monde entier, et surtout, raconter l\'histoire derrière chaque pièce.',
        author: 'Hassan Berrada, maître artisan en zellige à Fès'
      },
      {
        type: 'heading',
        content: 'Formation et innovation : les clés du succès'
      },
      {
        type: 'paragraph',
        content: 'Cette transition vers le digital ne s\'est pas faite du jour au lendemain. Elle est le fruit d\'initiatives publiques et privées visant à former les artisans aux outils numériques et aux techniques de marketing en ligne.'
      },
      {
        type: 'paragraph',
        content: 'L\'innovation joue également un rôle crucial dans cette renaissance. Sans dénaturer les techniques traditionnelles, de nombreux artisans adaptent leurs créations aux goûts et aux besoins contemporains, créant ainsi une fusion harmonieuse entre héritage et modernité.'
      },
      {
        type: 'heading',
        content: 'Les défis à relever'
      },
      {
        type: 'paragraph',
        content: 'Malgré ces avancées prometteuses, des défis subsistent. L\'accès à internet reste inégal dans les zones rurales, la logistique peut s\'avérer complexe et la concurrence internationale est rude.'
      },
      {
        type: 'paragraph',
        content: 'Pourtant, l\'authenticité, la qualité et l\'histoire unique de l\'artisanat marocain constituent des atouts indéniables dans un marché mondial de plus en plus standardisé. À l\'heure où les consommateurs recherchent du sens dans leurs achats, ces produits porteurs d\'identité et de tradition ont plus que jamais leur place.'
      },
      {
        type: 'paragraph',
        content: 'Le mariage entre savoir-faire ancestral et technologies modernes pourrait bien être la clé d\'une renaissance durable de l\'artisanat marocain, permettant de préserver ce patrimoine vivant tout en lui offrant un avenir prometteur à l\'échelle mondiale.'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Les tissages berbères : un héritage millénaire au cœur de la décoration contemporaine',
    slug: 'tissages-berberes-decoration-contemporaine',
    excerpt: 'Découvrez comment les tapis et textiles berbères, chargés de symboles et d\'histoire, sont devenus des pièces incontournables du design d\'intérieur moderne.',
    coverImage: 'https://images.unsplash.com/photo-1581885726825-41bccb592807?auto=format&fit=crop&q=80',
    category: 'Design & Décoration',
    tags: ['Textile', 'Design', 'Berbère', 'Tradition'],
    author: authors.marie,
    publishedAt: '2023-09-28',
    content: [
      {
        type: 'paragraph',
        content: 'Des montagnes de l\'Atlas marocain aux intérieurs les plus sophistiqués de New York ou Paris, les tapis berbères ont parcouru un long chemin. Ces œuvres textiles, créées depuis des millénaires par les femmes berbères, racontent à travers leurs motifs géométriques et leurs symboles une histoire riche de traditions et de croyances.'
      },
      {
        type: 'heading',
        content: 'Un langage symbolique tissé'
      },
      // Contenu simplifié pour cet exemple
      {
        type: 'paragraph',
        content: 'Chaque tapis berbère est une pièce unique qui raconte une histoire. Les motifs géométriques, les couleurs et les symboles utilisés varient selon les régions et les tribus, formant un véritable langage codifié transmis de mère en fille.'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'La céramique de Safi : quand tradition et innovation se rencontrent',
    slug: 'ceramique-safi-tradition-innovation',
    excerpt: 'Plongée dans l\'univers des potiers de Safi, qui perpétuent un savoir-faire séculaire tout en expérimentant de nouvelles formes et techniques.',
    coverImage: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&q=80',
    category: 'Artisanat & Innovation',
    tags: ['Céramique', 'Poterie', 'Maroc', 'Innovation'],
    author: authors.rita,
    publishedAt: '2023-08-12',
    content: [
      {
        type: 'paragraph',
        content: 'Sur la côte atlantique marocaine, la ville de Safi est depuis des siècles un centre névralgique de la céramique. Reconnue pour ses poteries aux couleurs vives et ses motifs caractéristiques, cette tradition artisanale connaît aujourd\'hui un renouveau créatif porté par une nouvelle génération de céramistes.'
      }
      // Contenu simplifié pour cet exemple
    ]
  },
  {
    id: 'post-4',
    title: 'L\'art du zellige : un kaléidoscope mathématique qui fascine le monde',
    slug: 'art-zellige-kaleidoscope-mathematique',
    excerpt: 'Explorez les secrets géométriques du zellige marocain, cette mosaïque complexe qui a inspiré mathématiciens, artistes et architectes à travers les âges.',
    coverImage: 'https://images.unsplash.com/photo-1560528257-62549914d907?auto=format&fit=crop&q=80',
    category: 'Art & Mathématiques',
    tags: ['Zellige', 'Géométrie', 'Architecture', 'Mathématiques'],
    author: authors.idriss,
    publishedAt: '2023-07-20',
    content: [
      {
        type: 'paragraph',
        content: 'Le zellige, cet art de la mosaïque géométrique qui orne palais, riads et mosquées du Maroc, est bien plus qu\'une simple décoration. Derrière sa beauté visuelle se cache une complexité mathématique fascinante qui continue d\'intriguer chercheurs et artistes du monde entier.'
      }
      // Contenu simplifié pour cet exemple
    ]
  },
  {
    id: 'post-5',
    title: 'Cuir de Fès : dans les coulisses des tanneries millénaires',
    slug: 'cuir-fes-coulisses-tanneries',
    excerpt: 'Voyage sensoriel au cœur des tanneries de Fès, où les techniques de tannage du cuir n\'ont presque pas changé depuis le Moyen Âge.',
    coverImage: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&q=80',
    category: 'Métiers d\'Art',
    tags: ['Cuir', 'Tannerie', 'Fès', 'Artisanat'],
    author: authors.rita,
    publishedAt: '2023-06-05',
    content: [
      {
        type: 'paragraph',
        content: 'L\'odeur puissante est la première chose qui vous frappe. Un mélange de chaux, de pigments naturels, de peaux d\'animaux et de plantes diverses. Bienvenue dans les tanneries de Fès, un monde à part où le temps semble s\'être arrêté au XIIe siècle.'
      }
      // Contenu simplifié pour cet exemple
    ]
  },
  {
    id: 'post-6',
    title: 'Le safran de Taliouine : l\'or rouge du Maroc',
    slug: 'safran-taliouine-or-rouge-maroc',
    excerpt: 'À la découverte du safran marocain, cette épice précieuse cultivée dans la région de Taliouine, entre tradition familiale et développement durable.',
    coverImage: 'https://images.unsplash.com/photo-1606791405792-1004f1d3e671?auto=format&fit=crop&q=80',
    category: 'Agriculture & Gastronomie',
    tags: ['Safran', 'Épices', 'Agriculture', 'Gastronomie'],
    author: authors.idriss,
    publishedAt: '2023-05-18',
    content: [
      {
        type: 'paragraph',
        content: 'Au lever du jour, dans les champs de la région de Taliouine, des dizaines de mains expertes cueillent avec précaution les fragiles fleurs violettes du Crocus sativus. La récolte du safran, l\'épice la plus chère du monde, est un moment sacré qui mobilise familles et villages entiers pendant quelques semaines d\'automne.'
      }
      // Contenu simplifié pour cet exemple
    ]
  },
  {
    id: 'post-7',
    title: 'Bijoux berbères : symboles et talismans dans la culture amazighe',
    slug: 'bijoux-berberes-symboles-talismans-culture-amazighe',
    excerpt: 'Exploration du rôle social, protecteur et identitaire des bijoux dans la culture berbère, véritables archives métalliques d\'une histoire millénaire.',
    coverImage: 'https://images.unsplash.com/photo-1613843451831-21ddd265d6f9?auto=format&fit=crop&q=80',
    category: 'Culture & Traditions',
    tags: ['Bijoux', 'Berbère', 'Symboles', 'Traditions'],
    author: authors.marie,
    publishedAt: '2023-04-02',
    content: [
      {
        type: 'paragraph',
        content: 'Dans la culture amazighe, les bijoux ne sont pas de simples ornements. Ce sont des marqueurs sociaux, des protections magiques, des dotations économiques et des œuvres d\'art porteuses d\'une symbolique profonde, transmises de génération en génération.'
      }
      // Contenu simplifié pour cet exemple
    ]
  }
];
