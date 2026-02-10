import { useEffect, useState } from 'react';

/**
 * Cross-browser compatible hook for detecting reduced motion preference
 * Includes fallback for older Safari MediaQueryList listener APIs
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Modern browsers support addEventListener
    // Older Safari versions use addListener (deprecated but still needed for compatibility)
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Try modern API first
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback to deprecated API for older Safari
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    // No cleanup needed if neither API is available
    return undefined;
  }, []);

  return prefersReducedMotion;
}
