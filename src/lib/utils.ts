
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for combining Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounce function to prevent rapid consecutive calls
 * @param func The function to debounce
 * @param wait The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Helper function for handling image fallbacks
 * @param imageUrl The original image URL
 * @param fallbackUrl Optional custom fallback URL
 * @returns A usable image URL with fallback handling
 */
export const getImageWithFallback = (
  imageUrl: string | undefined, 
  fallbackUrl: string = "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg"
) => {
  if (!imageUrl) {
    return fallbackUrl;
  }
  
  // Clean URL from any tokens if present
  const cleanUrl = imageUrl.split('?')[0];
  return cleanUrl;
};

/**
 * Format price with proper currency
 * @param price The price value
 * @param locale The locale for formatting
 * @param currency The currency code
 * @returns Formatted price string
 */
export const formatPrice = (
  price?: number | null, 
  locale: string = 'fr-MA', 
  currency: string = 'MAD'
): string => {
  if (price === undefined || price === null) return '—';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Truncate text to a specific length with ellipsis
 * @param text The input text
 * @param maxLength Maximum allowed length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Calculate discount percentage
 * @param originalPrice The original price
 * @param discountPrice The discounted price
 * @returns Discount percentage as a number
 */
export const calculateDiscountPercentage = (
  originalPrice?: number | null, 
  discountPrice?: number | null
): number => {
  if (!originalPrice || !discountPrice || originalPrice <= 0 || discountPrice >= originalPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};
