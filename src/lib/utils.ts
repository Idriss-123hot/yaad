
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a debounce function to prevent rapid consecutive calls
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

// Add a utility function for handling image fallbacks with enhanced error handling
export const getImageWithFallback = (imageUrl: string | undefined) => {
  if (!imageUrl) {
    console.log("No image URL provided, returning fallback");
    return "https://hijgrzabkfynlomhbzij.supabase.co/storage/v1/object/public/products/Blog%20et%20home%20page/test.jpg";
  }
  
  // Clean URL from any tokens if present
  const cleanUrl = imageUrl.split('?')[0];
  console.log("Using image URL:", cleanUrl);
  
  return cleanUrl;
};
