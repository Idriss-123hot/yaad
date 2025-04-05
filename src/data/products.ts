import { Product, ProductWithArtisan } from '@/models/types';
import { categoriesData } from './categories';

// Helper function to generate a product ID
const generateProductId = (mainCategory: string, subcategory: string, productType: string): string => {
  return `${mainCategory}-${subcategory}-${productType}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
};

// Helper function to generate a placeholder price between min and max
const generatePrice = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Generate products for each subcategory
export const generateCategoryProducts = (): ProductWithArtisan[] => {
  const products: ProductWithArtisan[] = [];
  
  // Placeholder image - using the specified URL
  const placeholderImage = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//test.jpg";
  
  // Process each main category
  categoriesData.forEach((mainCategory) => {
    // Process each subcategory
    mainCategory.subcategories?.forEach((subcategory) => {
      // For each subcategory, create one product
      const productId = generateProductId(mainCategory.id, subcategory.id, subcategory.name);
      const price = generatePrice(30, 300);
      const hasDiscount = Math.random() > 0.7; // 30% chance of discount
      const discountPrice = hasDiscount ? price * 0.8 : undefined; // 20% discount
      
      // Create the product
      const product: ProductWithArtisan = {
        id: productId,
        title: `${subcategory.name} - Produit Artisanal Marocain`,
        description: `Authentique ${subcategory.name.toLowerCase()} marocain fabriqué à la main par des artisans locaux utilisant des techniques traditionnelles transmises de génération en génération. Chaque pièce est unique et témoigne du riche patrimoine de l'artisanat marocain.`,
        price: price,
        discountPrice: discountPrice,
        category: mainCategory.name,
        tags: [subcategory.name.toLowerCase(), mainCategory.name.toLowerCase(), 'fait main', 'marocain'],
        images: [placeholderImage, placeholderImage], // Same placeholder for both images
        stock: Math.floor(Math.random() * 20) + 1, // Random stock between 1 and 20
        artisanId: `${Math.floor(Math.random() * 10) + 1}`, // Random artisan ID between 1 and 10
        rating: (Math.random() * 2) + 3, // Random rating between 3 and 5
        reviewCount: Math.floor(Math.random() * 50), // Random review count between 0 and 50
        featured: false,
        createdAt: new Date(),
        material: 'matériaux marocains authentiques',
        origin: 'maroc',
        subcategory: subcategory.id,
        categoryId: mainCategory.id,
        subcategoryId: subcategory.id
      };
      
      products.push(product);
    });
  });
  
  // Add our specific product assignments
  const specificProducts = [
    {
      id: 'ceramic-vase',
      title: 'Vase en Céramique Fait Main',
      mainCategory: 'home-decor',
      subcategory: 'living-room-bedroom',
      artisanId: '1', // Aicha Lakhdar
      images: [
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//grand-vase-girafe-du-maroc-artisanal-fait-main-elegant-design-trip%203.jpeg'
      ]
    },
    {
      id: 'wool-blanket',
      title: 'Couverture en Laine Tissée Main',
      mainCategory: 'home-decor',
      subcategory: 'textile',
      artisanId: '2', // Karim Belouz
      images: [
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Hand-woven%20Wool%20Blanket%201.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Hand-woven%20Wool%20Blanket%20%202.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//Hand-woven%20Wool%20Blanket%20%203.jpeg'
      ]
    },
    {
      id: 'wooden-serving-board',
      title: 'Planche de Service en Bois Artisanale',
      mainCategory: 'home-decor',
      subcategory: 'dining',
      artisanId: '7', // Amina Chaoui
      images: [
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-281478.webp',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-796823_1800x1800%202.webp',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//wooden-oval-cheese-board-with-arabic-patterns-cutting-board-maison-bagan-819467_1800x1800%203.webp'
      ]
    },
    {
      id: 'silver-earrings',
      title: 'Boucles d\'Oreilles Artisanales en Argent',
      mainCategory: 'women',
      subcategory: 'jewelry',
      artisanId: '8', // Mohammed Idrissi
      images: [
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//boucles-d-oreilles-berbere-touareg%201.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//boucles-d-oreilles-berbere-touareg%202.jpeg',
        'https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products//boucles-d-oreilles-berbere-touareg%203.jpeg'
      ]
    }
  ];
  
  // Find and update the specific products
  specificProducts.forEach(specificProduct => {
    const existingProductIndex = products.findIndex(
      p => p.mainCategory === specificProduct.mainCategory && p.subcategory === specificProduct.subcategory
    );
    
    if (existingProductIndex !== -1) {
      // Update the existing product with specific details
      products[existingProductIndex].id = specificProduct.id;
      products[existingProductIndex].title = specificProduct.title;
      products[existingProductIndex].featured = true;
      products[existingProductIndex].artisanId = specificProduct.artisanId;
      products[existingProductIndex].images = specificProduct.images;
    }
  });
  
  return products;
};

// Generate all the products
export const PRODUCTS = generateCategoryProducts();

// Helper function to get products by main category and subcategory - updated to support multiple subcategories
export const getProductsByCategory = (categoryId?: string, subcategoryId?: string): ProductWithArtisan[] => {
  if (!categoryId) {
    return PRODUCTS;
  }
  
  // Show all products in the main category if no subcategory filter
  if (!subcategoryId) {
    return PRODUCTS.filter(product => product.categoryId === categoryId);
  }
  
  // For backward compatibility
  const subcategories = subcategoryId.split(',');
  
  // If multiple subcategories, show all products from any of the selected subcategories
  if (subcategories.length > 1) {
    return PRODUCTS.filter(
      product => product.categoryId === categoryId && 
                subcategories.includes(product.subcategoryId || '')
    );
  }
  
  // Single subcategory case
  return PRODUCTS.filter(
    product => product.categoryId === categoryId && product.subcategoryId === subcategoryId
  );
};

// Helper to get a product by ID
export const getProductById = (id: string): ProductWithArtisan | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

// Helper to get products by artisanId
export const getProductsByArtisan = (artisanId: string): ProductWithArtisan[] => {
  return PRODUCTS.filter(product => product.artisanId === artisanId);
};
