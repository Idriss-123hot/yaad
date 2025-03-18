
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  variations?: ProductVariation[];
  stock: number;
  artisanId: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: Date;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g., "Size", "Color"
  options: string[]; // e.g., ["Small", "Medium", "Large"] or ["Red", "Blue"]
}

export interface Artisan {
  id: string;
  name: string;
  bio: string;
  location: string;
  profileImage: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  productCount: number;
  featured?: boolean;
  joinedDate: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  productCount: number;
}

// Sample data for our initial UI
export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Ceramics & Pottery',
    slug: 'ceramics-pottery',
    description: 'Handcrafted ceramic pieces and artisanal pottery',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80',
    productCount: 128
  },
  {
    id: '2',
    name: 'Textiles & Fabrics',
    slug: 'textiles-fabrics',
    description: 'Hand-woven textiles and artisanal fabric creations',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80',
    productCount: 86
  },
  {
    id: '3',
    name: 'Woodworking',
    slug: 'woodworking',
    description: 'Finely crafted wooden items from skilled artisans',
    image: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?auto=format&fit=crop&q=80',
    productCount: 64
  },
  {
    id: '4',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Unique handcrafted jewelry pieces from independent artisans',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
    productCount: 112
  }
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Handmade Ceramic Vase',
    description: 'A beautiful handcrafted ceramic vase with natural glaze finish.',
    price: 89.99,
    category: 'Ceramics & Pottery',
    tags: ['vase', 'ceramics', 'home decor'],
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c481b8230?auto=format&fit=crop&q=80'],
    stock: 5,
    artisanId: '1',
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    createdAt: new Date('2023-09-15')
  },
  {
    id: '2',
    title: 'Hand-woven Wool Blanket',
    description: 'Luxurious hand-woven wool blanket using traditional techniques.',
    price: 149.99,
    category: 'Textiles & Fabrics',
    tags: ['blanket', 'wool', 'handwoven'],
    images: ['https://images.unsplash.com/photo-1612546958210-6c6c2c221919?auto=format&fit=crop&q=80'],
    stock: 3,
    artisanId: '2',
    rating: 4.9,
    reviewCount: 18,
    featured: true,
    createdAt: new Date('2023-10-01')
  },
  {
    id: '3',
    title: 'Handcrafted Wooden Serving Board',
    description: 'Elegant serving board made from sustainable hardwood.',
    price: 59.99,
    discountPrice: 49.99,
    category: 'Woodworking',
    tags: ['kitchen', 'serving', 'wood'],
    images: ['https://images.unsplash.com/photo-1633953142937-de17f8f59f32?auto=format&fit=crop&q=80'],
    stock: 8,
    artisanId: '3',
    rating: 4.7,
    reviewCount: 32,
    featured: true,
    createdAt: new Date('2023-08-22')
  },
  {
    id: '4',
    title: 'Artisanal Silver Earrings',
    description: 'Delicate silver earrings handcrafted by skilled artisans.',
    price: 79.99,
    category: 'Jewelry',
    tags: ['earrings', 'silver', 'accessories'],
    images: ['https://images.unsplash.com/photo-1630019852942-7a3660ade834?auto=format&fit=crop&q=80'],
    stock: 12,
    artisanId: '4',
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    createdAt: new Date('2023-10-10')
  }
];

export const SAMPLE_ARTISANS: Artisan[] = [
  {
    id: '1',
    name: 'Elena Martinez',
    bio: 'Ceramicist with 15 years of experience specializing in minimalist designs inspired by nature.',
    location: 'Barcelona, Spain',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578749556568-bc2c481b8230?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 87,
    productCount: 24,
    featured: true,
    joinedDate: new Date('2022-03-15')
  },
  {
    id: '2',
    name: 'Thomas Wei',
    bio: 'Textile artist specializing in hand-woven pieces using traditional looms and organic materials.',
    location: 'Portland, USA',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1612546958210-6c6c2c221919?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 62,
    productCount: 18,
    featured: true,
    joinedDate: new Date('2022-06-10')
  },
  {
    id: '3',
    name: 'Fatima Zahra Kabbaj',
    bio: 'Maître artisane spécialisée dans les tapis berbères traditionnels, perpétuant un savoir-faire familial vieux de trois générations.',
    location: 'Marrakech, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581885726825-41bccb592807?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590076082845-8ce8c3abd51e?auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 94,
    productCount: 32,
    featured: true,
    joinedDate: new Date('2022-01-20')
  },
  {
    id: '4',
    name: 'Hamid Benani',
    bio: 'Artisan céramiste de Safi, créant des poteries aux motifs bleus traditionnels tout en innovant avec des designs contemporains.',
    location: 'Safi, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 68,
    productCount: 29,
    featured: false,
    joinedDate: new Date('2022-05-15')
  },
  {
    id: '5',
    name: 'Yasmine Alaoui',
    bio: 'Artisane du zellige formée aux techniques ancestrales de Fès, créant des mosaïques géométriques complexes pour des projets internationaux.',
    location: 'Fès, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560528257-62549914d907?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551732998-9573f695fdbb?auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 76,
    productCount: 21,
    featured: true,
    joinedDate: new Date('2022-07-10')
  },
  {
    id: '6',
    name: 'Omar Benjelloun',
    bio: 'Maroquinier d\'exception créant des pièces en cuir selon les techniques traditionnelles de tannage de Fès, de la sélection des peaux à la finition.',
    location: 'Fès, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473518501884-1e99c39aa810?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 58,
    productCount: 25,
    featured: false,
    joinedDate: new Date('2022-04-05')
  },
  {
    id: '7',
    name: 'Amina Chaoui',
    bio: 'Artisane du bois de cèdre, sculptant des objets décoratifs et utilitaires inspirés par les motifs traditionnels du Moyen Atlas.',
    location: 'Ifrane, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1485811661309-ab85183a729c?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305f3?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 42,
    productCount: 19,
    featured: false,
    joinedDate: new Date('2022-08-20')
  },
  {
    id: '8',
    name: 'Mohammed Idrissi',
    bio: 'Bijoutier traditionnel de la ville bleue, perpétuant l\'art de la bijouterie berbère en argent avec des techniques transmises depuis sept générations.',
    location: 'Chefchaouen, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1613843451831-21ddd265d6f9?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewCount: 88,
    productCount: 34,
    featured: true,
    joinedDate: new Date('2022-02-10')
  },
  {
    id: '9',
    name: 'Rachida Tazi',
    bio: 'Tisserande experte en tapis de la région d\'Ourika, alliant motifs berbères traditionnels et couleurs naturelles issues de teintures végétales.',
    location: 'Ourika, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1588701177361-c42359b29f68?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581885726825-41bccb592807?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580902394343-c767c787efcb?auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 59,
    productCount: 22,
    featured: false,
    joinedDate: new Date('2022-09-01')
  },
  {
    id: '10',
    name: 'Karim Berrada',
    bio: 'Maître dans l\'art du cuivre martelé de Fès, façonnant des lanternes, plateaux et objets décoratifs selon des techniques ancestrales.',
    location: 'Marrakech, Maroc',
    profileImage: 'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1603238738442-905371202b92?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewCount: 71,
    productCount: 27,
    featured: true,
    joinedDate: new Date('2022-06-25')
  }
];
