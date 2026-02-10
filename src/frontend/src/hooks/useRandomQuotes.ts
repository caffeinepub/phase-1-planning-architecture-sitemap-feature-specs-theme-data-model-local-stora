import { useMemo } from 'react';
import { useLocation } from '@tanstack/react-router';
import { selectRandomQuotes } from '@/lib/randomQuotes';

/**
 * Hook that provides 2-3 random quotes per route/page
 * Quotes are stable during a single page view but change on navigation
 */
export function useRandomQuotes(count: 2 | 3 = 3): string[] {
  const location = useLocation();

  // Regenerate quotes when pathname changes
  const quotes = useMemo(() => {
    return selectRandomQuotes(count);
  }, [location.pathname, count]);

  return quotes;
}
