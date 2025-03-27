
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
        title: `${subcategory.name} - Moroccan Artisanal Product`,
        description: `Authentic Moroccan ${subcategory.name.toLowerCase()} handcrafted by local artisans using traditional techniques passed down through generations. Each piece is unique and showcases the rich heritage of Moroccan craftsmanship.`,
        price: price,
        discountPrice: discountPrice,
        category: mainCategory.name,
        tags: [subcategory.name.toLowerCase(), mainCategory.name.toLowerCase(), 'handmade', 'moroccan'],
        images: [placeholderImage, placeholderImage], // Same placeholder for both images
        stock: Math.floor(Math.random() * 20) + 1, // Random stock between 1 and 20
        artisanId: `${Math.floor(Math.random() * 10) + 1}`, // Random artisan ID between 1 and 10
        rating: (Math.random() * 2) + 3, // Random rating between 3 and 5
        reviewCount: Math.floor(Math.random() * 50), // Random review count between 0 and 50
        featured: false,
        createdAt: new Date(),
        material: 'authentic moroccan materials',
        origin: 'morocco',
        subcategory: subcategory.id,
        mainCategory: mainCategory.id
      };
      
      products.push(product);
    });
  });
  
  // Add our specific product assignments
  const specificProducts = [
    {
      id: 'handmade-ceramic-vase',
      title: 'Handmade Ceramic Vase',
      mainCategory: 'home-decor',
      subcategory: 'living-room-bedroom'
    },
    {
      id: 'handwoven-wool-blanket',
      title: 'Handwoven Wool Blanket',
      mainCategory: 'home-decor',
      subcategory: 'textile'
    },
    {
      id: 'handcrafted-wooden-plate',
      title: 'Handcrafted Wooden Plate',
      mainCategory: 'home-decor',
      subcategory: 'dining'
    },
    {
      id: 'artisanal-silver-earrings',
      title: 'Artisanal Silver Earrings',
      mainCategory: 'women',
      subcategory: 'jewelry'
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
    }
  });
  
  return products;
};

// Generate all the products
export const PRODUCTS = generateCategoryProducts();

// Helper function to get products by main category and subcategory
export const getProductsByCategory = (mainCategory?: string, subcategory?: string): ProductWithArtisan[] => {
  if (!mainCategory) {
    return PRODUCTS;
  }
  
  if (!subcategory) {
    return PRODUCTS.filter(product => product.mainCategory === mainCategory);
  }
  
  return PRODUCTS.filter(product => product.mainCategory === mainCategory && product.subcategory === subcategory);
};

// Helper to get a product by ID
export const getProductById = (id: string): ProductWithArtisan | undefined => {
  return PRODUCTS.find(product => product.id === id);
};
