
export interface BlogPostContent {
  type: 'paragraph' | 'heading' | 'image' | 'quote';
  content?: string;
  url?: string;
  caption?: string;
  author?: string;
}

export interface BlogPostAuthor {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  author: BlogPostAuthor;
  content: BlogPostContent[];
  tags: string[];
}

// Author data
const authors = {
  mohamed: {
    id: 'mohamed',
    name: 'Mohamed Belkacem',
    role: 'Spécialiste en Artisanat Marocain',
    avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Mohamed-Artisan.jpg',
  },
  samira: {
    id: 'samira',
    name: 'Samira El Madani',
    role: 'Artisane et Historienne',
    avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Samira-Artisans.jpg',
  },
  karim: {
    id: 'karim',
    name: 'Karim Benchekroun',
    role: 'Expert en Culture Marocaine',
    avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Karim-Artisan.jpg',
  },
  leila: {
    id: 'leila',
    name: 'Leila Zouiten',
    role: 'Designer et Artisane',
    avatar: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Portrait-Leila-Artisan.jpg',
  },
};

// Blog posts data - Updated with new content
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'artisanat-traditionnel-marocain-ere-digital',
    title: "L'Âge d'Or Numérique : Quand l'Artisanat Marocain Tisse sa Toile sur le Web",
    excerpt: "Comment l'artisanat marocain traditionnel renaît à l'ère du digital et conquiert le monde en ligne.",
    category: 'Innovation',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//artisanat-digital-maroc.jpg',
    publishedAt: '2023-06-15',
    author: authors.mohamed,
    content: [
      {
        type: 'paragraph',
        content: "Sous le ciel ocre des médinas, là où les mains savent encore lire le langage secret de la terre et du temps, une révolution silencieuse s'éveille. L'artisanat marocain, héritier de siècles de savoir-faire, ne se contente plus de murmurer ses légendes entre les murs des souks. Il s'envole, porté par les ailes invisibles du numérique, pour conquérir le monde."
      },
      {
        type: 'paragraph',
        content: "Imaginez une tisserande de Midelt dont les tapis berbères, jadis vendus à la lueur des bougies, se déploient aujourd'hui sur des galeries virtuelles, admirés à Tokyo ou à Montréal. Visualisez un potier de Safi filmant en direct le ballet hypnotique de son tour, captivant des milliers de curieux avides d'authenticité. Le digital n'est pas un ennemi ; c'est un pont entre les générations, une caresse offerte aux traditions pour qu'elles survivent à l'urgence du moderne."
      },
      {
        type: 'image',
        url: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//artisan-fes-digital.jpg',
        caption: 'Artisan de Fès partageant son savoir-faire sur les réseaux sociaux'
      },
      {
        type: 'paragraph',
        content: "Les plateformes en ligne deviennent des caravansérails 2.0, où les artisans partagent leurs récits autant que leurs créations. Un maroquinier de Fès explique l'alchimie des tanins végétaux via des tutoriels, tandis qu'une bijoutière du Haut Atlas dévoile le sens sacré des fibules en argent sur Instagram. Chaque clic est une porte ouverte sur un univers où le temps se suspend, où chaque objet raconte une odyssée : celle de la main qui l'a façonné, de la matière qui a résisté, de l'âme qui a persévéré."
      },
      {
        type: 'quote',
        content: "Notre savoir-faire ancestral ne doit pas rester figé dans les musées. Grâce au digital, nous le faisons vivre et évoluer, tout en préservant son âme authentique.",
        author: "Aïcha Bouharrat, tisserande à Midelt"
      },
      {
        type: 'paragraph',
        content: "Mais cette renaissance n'est pas qu'une question de visibilité. C'est une reconquête. En digitalisant leurs métiers, les artisans réinventent leur liberté. Ils fixent leurs prix, dialoguent avec des collectionneurs, s'émancipent des intermédiaires. Le web devient un zellige de possibilités : chaque pièce s'emboîte pour former une mosaïque plus vaste, où le Maroc rayonne comme un phare culturel."
      },
      {
        type: 'heading',
        content: "Le Digital, Nouveau Souffle de l'Artisanat"
      },
      {
        type: 'paragraph',
        content: "Et si, au fond, cette ère digitale était un retour aux sources ? Autrefois, les caravanes reliaient le Maroc au reste du monde. Aujourd'hui, les pixels accomplissent le même miracle : faire voyager l'artisanat sans lui arracher son âme."
      }
    ],
    tags: ['artisanat', 'digital', 'tradition', 'innovation', 'maroc']
  },
  {
    id: '2',
    slug: 'tapis-berberes-memoires-tissees-atlas',
    title: 'Les Tapis Berbères : Mémoires Tissées de l\'Atlas',
    excerpt: "Découvrez comment les tissages berbères millénaires continuent d'inspirer la décoration contemporaine mondiale.",
    category: 'Textiles',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//tapis-berbere-memoire.jpg',
    publishedAt: '2023-07-22',
    author: authors.samira,
    content: [
      {
        type: 'paragraph',
        content: "Dans la laine nouée des tapis berbères, chaque motif est une lettre, chaque couleur un chuchotement des montagnes. Ces tissages ne sont pas de simples objets ; ce sont des archives vivantes, des cartographies intimes où se mêlent les rêves des ancêtres et les souffles du vent de l'Atlas."
      },
      {
        type: 'paragraph',
        content: "Depuis des millénaires, les femmes berbères parlent à la laine. Leurs métiers à tisser verticaux, semblables à des portes ouvertes sur l'infini, transforment les fils en récits. Un triangle évoque une montagne sacrée, un losange incarne la féminité, un zigzag raconte le chemin sinueux de la vie. Ces symboles, transmis de mère en fille, sont un alphabet silencieux qui résiste au temps. Aujourd'hui, ces mêmes motifs se glissent dans les intérieurs épurés de Paris ou de New York, où leurs géométries ancestrales dialoguent avec le béton et le métal."
      },
      {
        type: 'image',
        url: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//tisserande-berbere.jpg',
        caption: 'Tisserande berbère travaillant sur un métier à tisser traditionnel'
      },
      {
        type: 'paragraph',
        content: "Au cœur du village de Taznakht, Aïcha, 62 ans, tresse encore la laine avec des pigments naturels : le rouge de la garance, le bleu de l'indigo, le jaune du safran. « Mes tapis sont comme mes enfants, confie-t-elle. Ils partent voyager, mais ils emportent toujours un morceau de notre terre. » Ses créations, jadis échangées contre de l'huile ou des céréales, sont désormais exposées dans des galeries d'art contemporain. Des designers les suspendent comme des toiles abstraites, captivés par leur puissance narrative."
      },
      {
        type: 'heading',
        content: "Du Sol aux Murs : L'Évolution des Tapis Berbères"
      },
      {
        type: 'paragraph',
        content: "Le tapis berbère n'est plus cantonné aux sols ; il devient mural, tenture, œuvre à part entière. Sur les réseaux sociaux, des influenceurs déroulent ces « peintures textiles » devant des millions d'abonnés, tandis que des ateliers collaboratifs invitent les voyageurs à nouer leurs propres histoires. Le passé et le présent s'enlacent, prouvant que la beauté n'a pas d'âge—seulement des interprétations infinies."
      },
      {
        type: 'quote',
        content: "Un tapis berbère n'est pas qu'un simple objet décoratif. C'est une histoire, un poème, un morceau d'âme tissé dans chaque nœud.",
        author: "Ahmed Ouadghiri, collectionneur"
      }
    ],
    tags: ['tapis', 'berbère', 'textiles', 'décoration', 'tradition']
  },
  {
    id: '3',
    slug: 'ceramique-safi-tradition-innovation',
    title: 'Safi, ou la Danse du Feu : L\'Argile qui Chante Entre Deux Mondes',
    excerpt: "À Safi, les traditions céramiques séculaires rencontrent l'innovation contemporaine, créant un art en constante évolution.",
    category: 'Céramique',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//ceramique-safi-potier.jpg',
    publishedAt: '2023-08-10',
    author: authors.karim,
    content: [
      {
        type: 'paragraph',
        content: "À Safi, ville bercée par l'Atlantique, la terre se fait alchimiste. Depuis le XIIe siècle, les potiers y dansent avec le feu, transformant l'argile en joyaux émaillés. Mais ici, la tradition ne se fossilise pas : elle se réinvente, audacieuse, tel un vase aux courbes inattendues."
      },
      {
        type: 'paragraph',
        content: "Dans les ateliers enfumés où la chaleur dessine des fantômes sur les murs, les artisans pétrissent la glaise avec la même ferveur que leurs aïeux. Le bleu de cobalt, hérité des Perses, coule encore comme une rivière nocturne sur les plats et les tajines. Pourtant, Safi ose aujourd'hui des mariages inédits : des céramiques noires et or inspirées de l'art déco, des formes asymétriques qui défient la gravité, ou des collaborations avec des street artists marocains."
      },
      {
        type: 'image',
        url: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//poterie-safi-moderne.jpg',
        caption: 'Fusion d\'art traditionnel et contemporain dans les céramiques de Safi'
      },
      {
        type: 'quote',
        content: "Le secret, c'est d'écouter l'argile. Elle refuse d'être prisonnière d'un style.",
        author: "Youssef Dahmani, maître potier"
      },
      {
        type: 'paragraph',
        content: "« Le secret, c'est d'écouter l'argile, murmure Youssef, maître potier. Elle refuse d'être prisonnière d'un style. » Ses dernières créations ? Des vases fusionnant motifs berbères et graffiti, ou des carreaux émaillés intégrés à des installations urbaines. Sur Instagram, les vidéos de son tour en mouvement—hypnotiques, presque méditatives—font le tour du monde."
      },
      {
        type: 'heading',
        content: "Au-delà de l'Utilitaire : La Céramique comme Art"
      },
      {
        type: 'paragraph',
        content: "La céramique de Safi n'est plus un art utilitaire ; c'est une déclaration. Elle rappelle que l'innovation n'est pas une rupture, mais un dialogue : celui de la main qui respecte la mémoire et de l'esprit qui rêve d'horizons nouveaux."
      }
    ],
    tags: ['céramique', 'safi', 'poterie', 'art', 'innovation']
  },
  {
    id: '4',
    slug: 'zellige-murs-geometrie',
    title: 'Zellige : Les Murs qui Rêvent en Géométrie',
    excerpt: "L'art ancestral du zellige marocain fascine le monde entier par sa complexité mathématique et sa beauté kaléidoscopique.",
    category: 'Architecture',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//zellige-mosaique-fes.jpg',
    publishedAt: '2023-09-05',
    author: authors.leila,
    content: [
      {
        type: 'paragraph',
        content: "Le zellige est un sortilège. Une céramique éclatée en mille fragments, qui se réassemble en étoiles, en fleurs, en labyrinthes parfaits. Cet art né à Fès au Xe siècle est une prière mathématique, un puzzle où chaque pièce—taillée à la main—s'emboîte avec la précision d'un théorème."
      },
      {
        type: 'paragraph',
        content: "Dans les médersas et les palais, les murs murmurent des équations colorées. Les maâlems (maîtres artisans) travaillent sans plan, guidés par un savoir inscrit dans leur gestuelle. « Chaque coup de maillet sur la lame est une note de musique, explique Hassan, dont la famille sculpte le zellige depuis sept générations. Le motif naît lentement, comme une mélodie. »"
      },
      {
        type: 'image',
        url: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//artisan-zellige-travail.jpg',
        caption: 'Un maâlem de Fès taillant méticuleusement des pièces de zellige'
      },
      {
        type: 'heading',
        content: "Une Géométrie Universelle"
      },
      {
        type: 'paragraph',
        content: "Aujourd'hui, ce langage géométrique séduit architectes et designers. À Miami, un hôtel s'habille de zellige turquoise en hommage à la mer Méditerranéenne ; à Marrakech, une artiste contemporaine détourne ses éclats en bijoux minimalistes. Même les jeux vidéo s'en inspirent, pixelisant ses arabesques pour créer des mondes virtuels."
      },
      {
        type: 'quote',
        content: "Le zellige est une méditation visuelle. Il nous rappelle que l'ordre et la beauté peuvent naître de milliers de fragments apparemment chaotiques.",
        author: "Hassan Bennani, maître zelligeur"
      },
      {
        type: 'paragraph',
        content: "Le zellige, autrefois symbole de pouvoir, devient universel. Il prouve que la rigueur peut être poésie, et que la beauté naît souvent de la fragmentation… pour mieux révéler l'unité."
      }
    ],
    tags: ['zellige', 'mosaïque', 'géométrie', 'architecture', 'fès']
  },
  {
    id: '5',
    slug: 'cuir-fes-tanneries-millenaires',
    title: 'Fès, ou l\'Épopée du Cuir : Des Nuances qui Dansent avec le Temps',
    excerpt: "Dans les anciennes tanneries de Fès, des techniques millénaires transforment la peau brute en cuir raffiné, entre tradition et modernité.",
    category: 'Artisanat',
    coverImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//tanneries-chouara-fes.jpg',
    publishedAt: '2023-09-25',
    author: authors.mohamed,
    content: [
      {
        type: 'paragraph',
        content: "À Fès, le cuir se tisse comme un poème dans l'odeur âcre des tanneries. Ici, les fosses de teinture ressemblent à une palette de peintre géante : rouge sang de coquelicot, jaune soleil de curcuma, bleu profond d'indigo. Depuis le IXe siècle, ces bassins creusés dans la terre sont des laboratoires où la peau brute se métamorphose en trésor."
      },
      {
        type: 'image',
        url: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//tanneurs-travail-fes.jpg',
        caption: 'Tanneurs au travail dans les fosses colorées des tanneries Chouara'
      },
      {
        type: 'paragraph',
        content: "Les maâlems des tanneries Chouwara travaillent encore à l'ancienne, les pieds nus dans les pigments, comme des danseurs dans une cérémonie sacrée. « Le cuir, c'est une matière vivante, explique Ahmed, dont la famille tanne depuis cinq siècles. Il respire, il résiste, il raconte chaque étape de sa transformation. » Les peaux, trempées dans des bains de chaux et de pigeon, puis polies à la main, deviennent souples et lumineuses."
      },
      {
        type: 'quote',
        content: "Chaque peau a son caractère, comme un être vivant. Notre travail est de révéler sa beauté cachée, d'accompagner sa transformation sans la forcer.",
        author: "Ahmed Sefrioui, tanneur de Fès"
      },
      {
        type: 'heading',
        content: "Le Cuir Marocain à l'Ère de la Mode Durable"
      },
      {
        type: 'paragraph',
        content: "Mais le cuir de Fès n'est plus l'apanage des babouches ou des selles de cheval. Aujourd'hui, il s'invite sur les podiums : sacs sculpturaux aux finitions métallisées, vestes fusionnant motifs berbères et coupes avant-gardistes. Des marques éthiques collaborent avec les tanneurs pour créer des collections « zéro déchet », où chaque chute devient un bijou ou une œuvre d'art."
      },
      {
        type: 'paragraph',
        content: "Sur YouTube, des documentaires montrent ce ballet chromatique, attirant des voyageurs en quête d'authenticité. Et dans l'ombre des cuves, une nouvelle génération rêve : et si ces techniques ancestrales pouvaient révolutionner la mode durable ?"
      }
    ],
    tags: ['cuir', 'tannerie', 'fès', 'artisanat', 'mode']
  }
];
