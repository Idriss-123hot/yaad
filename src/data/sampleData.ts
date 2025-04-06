
import { Category, Product, Artisan } from '@/models/types';

// Sample categories data for development
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

// Sample products data for development
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Handmade Ceramic Vase',
    description: 'A beautiful handcrafted ceramic vase with natural glaze finish.',
    price: 89.99,
    category: 'Ceramics & Pottery',
    subcategory: 'Vases',
    mainCategory: 'ceramics-pottery',
    tags: ['vase', 'ceramics', 'home decor'],
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c481b8230?auto=format&fit=crop&q=80'],
    stock: 5,
    artisanId: '1',
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    createdAt: new Date('2023-09-15'),
    material: 'ceramic',
    origin: 'handcrafted'
  },
  {
    id: '2',
    title: 'Hand-woven Wool Blanket',
    description: 'Luxurious hand-woven wool blanket using traditional techniques.',
    price: 149.99,
    category: 'Textiles & Fabrics',
    subcategory: 'Blankets',
    mainCategory: 'textiles-fabrics',
    tags: ['blanket', 'wool', 'handwoven'],
    images: ['https://images.unsplash.com/photo-1612546958210-6c6c2c221919?auto=format&fit=crop&q=80'],
    stock: 3,
    artisanId: '2',
    rating: 4.9,
    reviewCount: 18,
    featured: true,
    createdAt: new Date('2023-10-01'),
    material: 'wool',
    origin: 'handwoven'
  },
  {
    id: '3',
    title: 'Handcrafted Wooden Serving Board',
    description: 'Elegant serving board made from sustainable hardwood.',
    price: 59.99,
    discountPrice: 49.99,
    category: 'Woodworking',
    subcategory: 'Kitchen',
    mainCategory: 'woodworking',
    tags: ['kitchen', 'serving', 'wood'],
    images: ['https://images.unsplash.com/photo-1633953142937-de17f8f59f32?auto=format&fit=crop&q=80'],
    stock: 8,
    artisanId: '3',
    rating: 4.7,
    reviewCount: 32,
    featured: true,
    createdAt: new Date('2023-08-22'),
    material: 'wood',
    origin: 'sustainable'
  },
  {
    id: '4',
    title: 'Artisanal Silver Earrings',
    description: 'Delicate silver earrings handcrafted by skilled artisans.',
    price: 79.99,
    category: 'Jewelry',
    subcategory: 'Earrings',
    mainCategory: 'jewelry',
    tags: ['earrings', 'silver', 'accessories'],
    images: ['https://images.unsplash.com/photo-1630019852942-7a3660ade834?auto=format&fit=crop&q=80'],
    stock: 12,
    artisanId: '4',
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    createdAt: new Date('2023-10-10'),
    material: 'silver',
    origin: 'handcrafted'
  }
];
