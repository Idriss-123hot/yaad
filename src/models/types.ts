
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
  }
];
