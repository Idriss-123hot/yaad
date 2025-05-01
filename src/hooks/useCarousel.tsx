
import { useState, useRef } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";

/**
 * Custom hook for managing carousel state and references
 * 
 * Provides a simple interface for controlling embla carousels with React refs
 */
export function useCarousel() {
  const [carouselRef, api] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Set up scroll direction capabilities
  const onSelect = () => {
    if (!api) return;
    
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  // When API is available, set up event listeners
  if (api && !api.events().hasSubscriber(onSelect)) {
    api.on('select', onSelect);
    api.on('reInit', onSelect);
  }

  return {
    carouselRef,
    api,
    canScrollPrev,
    canScrollNext
  };
}

export default useCarousel;
