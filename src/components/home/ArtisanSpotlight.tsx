
// ⚠️ DEPRECATED - This file is maintained for backward compatibility only
// For displaying featured artisans, please use FeaturedArtisansCarousel instead
// This file will be removed in a future update

import React from 'react';
import FeaturedArtisansCarousel from './FeaturedArtisansCarousel';

export const ArtisanSpotlight = () => {
  console.warn('ArtisanSpotlight component is deprecated, please use FeaturedArtisansCarousel instead');
  return <FeaturedArtisansCarousel />;
};

export default ArtisanSpotlight;
