
// Structure des catégories complète selon l'arborescence demandée
export const categoriesData = [
  {
    id: "home-decor",
    name: "Home Decor",
    subcategories: [
      {
        id: "dining",
        name: "Dining",
        products: [
          { id: "cups-mugs", name: "Cups & Mugs" },
          { id: "placemats-coasters-trivets", name: "Placemats, Coasters & Trivets" },
          { id: "plates-bowls", name: "Plates & Bowls" },
          { id: "tagines", name: "Tagines" },
          { id: "teapots-tea-sets", name: "Teapots & Tea Sets" },
          { id: "trays-boards", name: "Trays & Boards" },
          { id: "table-linen", name: "Table Linen" },
        ]
      },
      {
        id: "living-room-bedroom",
        name: "Living Room & Bedroom",
        products: [
          { id: "baskets-pots-plates", name: "Baskets, Pots & Plates" },
          { id: "blankets", name: "Blankets" },
          { id: "candles-candlesticks", name: "Candles & Candlesticks" },
          { id: "cushions-pillow-cases", name: "Cushions & Pillow Cases" },
          { id: "home-fragrance", name: "Home Fragrance" },
          { id: "jars-vases-ashtrays", name: "Jars, Vases & Ashtrays" },
          { id: "lamps-lampshades", name: "Lamps & Lampshades" },
          { id: "oud-burners", name: "Oud Burners" },
          { id: "rugs", name: "Rugs" },
          { id: "stationery-games", name: "Stationery & Games" },
          { id: "plates-mirrors-wall-art", name: "Plates, Mirrors & Wall Art" },
        ]
      },
      {
        id: "textile",
        name: "Textile",
        products: [
          { id: "bed-linen", name: "Bed Linen" },
          { id: "blankets", name: "Blankets" },
          { id: "pillows", name: "Pillows" },
          { id: "towels", name: "Towels" },
          { id: "rugs", name: "Rugs" },
        ]
      },
      {
        id: "wall-decor",
        name: "Wall Decor",
        products: [
          { id: "mirrors", name: "Mirrors" },
          { id: "posters-canvas", name: "Posters & Canvas" },
          { id: "wall-embroidery", name: "Wall Embroidery" },
        ]
      },
      {
        id: "accent-furniture",
        name: "Accent Furniture",
        products: [
          { id: "moroccan-poufs-ottomans", name: "Moroccan Poufs & Ottomans" },
          { id: "moroccan-rugs", name: "Moroccan Rugs" },
          { id: "pillowcases", name: "Pillowcases" },
          { id: "side-tables", name: "Side Tables" },
          { id: "vases", name: "Vases" },
        ]
      },
      {
        id: "home-fragrance",
        name: "Home Fragrance",
        products: [
          { id: "candles", name: "Candles" },
          { id: "reed-diffuser", name: "Reed Diffuser" },
          { id: "scented-oils", name: "Scented Oils" },
          { id: "home-sprays", name: "Home Sprays" },
          { id: "home-fragrance-box", name: "Home Fragrance Box" },
        ]
      },
      {
        id: "kids",
        name: "Kids",
        products: [
          { id: "kids-decor", name: "Décoration pour enfants" },
          { id: "artisanal-toys", name: "Jouets artisanaux" },
          { id: "kids-textile", name: "Textile pour enfants" },
        ]
      }
    ]
  },
  {
    id: "women",
    name: "Women",
    subcategories: [
      {
        id: "clothing",
        name: "Clothing",
        products: [
          { id: "djellabas-gandouras", name: "Djellabas & Gandouras" },
          { id: "dresses-kimonos", name: "Dresses & Kimonos" },
          { id: "jackets-blazers-coats-capes", name: "Jackets, Blazers, Coats & Capes" },
          { id: "kaftans", name: "Kaftans" },
          { id: "skirts-shorts-pants", name: "Skirts, Shorts & Pants" },
          { id: "tops-tshirts-sweatshirts", name: "Tops, T-Shirts & Sweatshirts" },
        ]
      },
      {
        id: "bags",
        name: "Bags",
        products: [
          { id: "customize-it", name: "Customize It!" },
          { id: "backpacks-belt-bags", name: "Backpacks & Belt Bags" },
          { id: "cotton-tote-bags", name: "Cotton Tote Bags" },
          { id: "cross-body-bags", name: "Cross Body Bags" },
          { id: "french-baskets", name: "French Baskets" },
          { id: "jute-handbags", name: "Jute Handbags" },
          { id: "mini-bags-clutches", name: "Mini Bags & Clutches" },
          { id: "shoulder-bags", name: "Shoulder Bags" },
          { id: "summer-bags", name: "Summer Bags" },
          { id: "top-handle-bags", name: "Top Handle Bags" },
          { id: "travel-bags", name: "Travel Bags" },
          { id: "work-bags", name: "Work Bags" },
        ]
      },
      {
        id: "shoes",
        name: "Shoes",
        products: [
          { id: "moroccan-slippers", name: "Moroccan Slippers" },
          { id: "mules", name: "Mules" },
          { id: "sandals", name: "Sandals" },
          { id: "sneakers", name: "Sneakers" },
          { id: "flip-flops-slides", name: "Flip Flops & Slides" },
        ]
      },
      {
        id: "jewelry",
        name: "Jewelry",
        products: [
          { id: "bracelets", name: "Bracelets" },
          { id: "earrings", name: "Earrings" },
          { id: "necklaces", name: "Necklaces" },
          { id: "rings", name: "Rings" },
          { id: "jewelry-boxes", name: "Jewelry Boxes" },
          { id: "jewelry-sets", name: "Jewelry Sets" },
        ]
      },
      {
        id: "accessories",
        name: "Accessories",
        products: [
          { id: "phone-cases", name: "Phone Cases" },
          { id: "travel-accessories", name: "Travel Accessories" },
          { id: "work-accessories", name: "Work Accessories" },
        ]
      },
      {
        id: "kids",
        name: "Kids",
        products: [
          { id: "kids-clothing", name: "Vêtements pour enfants" },
          { id: "kids-accessories", name: "Accessoires pour enfants" },
        ]
      }
    ]
  },
  {
    id: "men",
    name: "Men",
    subcategories: [
      {
        id: "clothing",
        name: "Clothing",
        products: [
          { id: "djellabas", name: "Djellabas" },
          { id: "jackets-bombers", name: "Jackets & Bombers" },
          { id: "shirts-sweatshirts", name: "Shirts & Sweatshirts" },
          { id: "sweatshirts", name: "Sweatshirts" },
        ]
      },
      {
        id: "shoes",
        name: "Shoes",
        products: [
          { id: "moroccan-slippers", name: "Moroccan Slippers" },
          { id: "sneakers", name: "Sneakers" },
          { id: "flip-flops-slides", name: "Flip Flops & Slides" },
        ]
      },
      {
        id: "jewelry",
        name: "Jewelry",
        products: [
          { id: "bracelets", name: "Bracelets" },
          { id: "earrings", name: "Earrings" },
          { id: "necklaces", name: "Necklaces" },
          { id: "rings", name: "Rings" },
        ]
      },
      {
        id: "accessories",
        name: "Accessories",
        products: [
          { id: "bags", name: "Bags" },
          { id: "small-accessories", name: "Small Accessories" },
          { id: "tote-bags", name: "Tote Bags" },
        ]
      },
      {
        id: "kids",
        name: "Kids",
        products: [
          { id: "kids-clothing", name: "Vêtements pour enfants" },
          { id: "kids-accessories", name: "Accessoires pour enfants" },
        ]
      }
    ]
  },
  {
    id: "skincare",
    name: "Skincare",
    subcategories: [
      {
        id: "face-care",
        name: "Face Care",
        products: [
          { id: "face-mask", name: "Face Mask" },
          { id: "face-oil", name: "Face Oil" },
          { id: "face-scrubs", name: "Face Scrubs" },
          { id: "face-soaps", name: "Face Soaps" },
          { id: "face-toners-waters", name: "Face Toners & Waters" },
          { id: "lip-balms", name: "Lip Balms" },
        ]
      },
      {
        id: "hair-care",
        name: "Hair Care",
        products: [
          { id: "hair-oils", name: "Hair Oils" },
          { id: "hair-masks", name: "Hair Masks" },
          { id: "shampoos-conditioners", name: "Shampoos & Conditioners" },
        ]
      },
      {
        id: "body-care",
        name: "Body Care",
        products: [
          { id: "body-oils", name: "Body Oils" },
          { id: "body-scrubs", name: "Body Scrubs" },
          { id: "body-soap", name: "Body Soap" },
          { id: "hammam-essentials", name: "Hammam Essentials" },
          { id: "perfumes-body-sprays", name: "Perfumes & Body Sprays" },
        ]
      },
      {
        id: "gift-sets",
        name: "Gift Sets",
        products: [
          { id: "skincare-gift-sets", name: "Skincare Gift Sets" },
        ]
      }
    ]
  },
  {
    id: "gourmet",
    name: "Gourmet",
    subcategories: [
      {
        id: "culinary",
        name: "Culinary Products",
        products: [
          { id: "culinary-oils", name: "Culinary Oils" },
          { id: "amlou", name: "Amlou" },
          { id: "honey", name: "Honey" },
          { id: "spreads", name: "Spreads" },
          { id: "gourmet-gift-boxes", name: "Gourmet Gift Boxes" },
          { id: "teas-saffron", name: "Teas & Saffron" },
          { id: "sugar-molasses-waters-powders", name: "Sugar, Molasses, Waters & Powders" },
        ]
      }
    ]
  }
];
