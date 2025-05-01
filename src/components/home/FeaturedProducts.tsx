
// ⚠️ DEPRECATED - This file is maintained for backward compatibility only
// For displaying featured products, please use FeaturedProductsCarousel instead
// This file will be removed in a future update

import React from 'react';
import FeaturedProductsCarousel from './FeaturedProductsCarousel';

export const FeaturedProducts = () => {
  console.warn('FeaturedProducts component is deprecated, please use FeaturedProductsCarousel instead');
  return <FeaturedProductsCarousel />;
};

export default FeaturedProducts;
