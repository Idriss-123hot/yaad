// If this file doesn't exist, I'll create it with the necessary types

// Product Interfaces
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subcategory?: string;
  mainCategory?: string;
  tags: string[];
  images: string[];
  stock: number;
  artisanId: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: Date;
  material?: string;
  origin?: string;
  categoryId?: string;
  subcategoryId?: string;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  name: string;
  options: string[];
}

export interface ProductWithArtisan extends Product {
  artisan?: Artisan;
}

// Support message types
export interface SupportMessage {
  id: string;
  artisanId: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  respondedBy?: string;
}

// Artisan Interface
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
  featured: boolean;
  joinedDate: Date;
  description?: string;
  website?: string;
}

export interface ArtisanWithProfile extends Artisan {
  profilePhoto?: string;
  user?: {
    email?: string;
  };
}

// Category and Subcategory Interfaces
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
  productCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  parent_id: string;
}

// Sample data for development
export const SAMPLE_ARTISANS: Artisan[] = [
  {
    id: '1',
    name: 'Aicha Lakhdar',
    bio: 'Artisane céramiste depuis plus de 20 ans, spécialisée dans les techniques traditionnelles de Fès.',
    location: 'Fès',
    profileImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Aicha%20Lakhdar.jpg',
    galleryImages: [],
    rating: 4.8,
    reviewCount: 24,
    productCount: 15,
    featured: true,
    joinedDate: new Date('2022-01-15')
  },
  {
    id: '2',
    name: 'Karim Belouz',
    bio: 'Tisserand de tapis berbères, perpétuant un savoir-faire familial de quatre générations.',
    location: 'Marrakech',
    profileImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Karim%20Belouz.jpg',
    galleryImages: [],
    rating: 4.9,
    reviewCount: 18,
    productCount: 8,
    featured: false,
    joinedDate: new Date('2022-03-10')
  },
  {
    id: '7',
    name: 'Amina Chaoui',
    bio: 'Artisan du bois, créatrice d\'objets de décoration et d\'art de la table inspirés des traditions marocaines.',
    location: 'Essaouira',
    profileImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Amina%20Chaoui.jpg',
    galleryImages: [],
    rating: 4.7,
    reviewCount: 32,
    productCount: 22,
    featured: true,
    joinedDate: new Date('2021-10-05')
  },
  {
    id: '8',
    name: 'Mohammed Idrissi',
    bio: 'Bijoutier spécialisé dans l\'artisanat touareg et berbère, utilisant des techniques ancestrales.',
    location: 'Agadir',
    profileImage: 'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Mohammed%20Idrissi.jpg',
    galleryImages: [],
    rating: 4.9,
    reviewCount: 41,
    productCount: 30,
    featured: false,
    joinedDate: new Date('2022-02-18')
  },
];
