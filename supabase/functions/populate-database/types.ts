
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
  material?: string;
  origin?: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  options: string[];
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
