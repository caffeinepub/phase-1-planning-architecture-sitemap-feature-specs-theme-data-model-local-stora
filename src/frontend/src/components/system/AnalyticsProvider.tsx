import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useActor } from '../../hooks/useActor';
import { trackPageView } from '../../lib/analytics';

/**
 * Analytics provider that tracks navigation events
 */
export default function AnalyticsProvider() {
  const router = useRouter();
  const { actor } = useActor();

  useEffect(() => {
    // Track initial page view
    trackPageView(window.location.pathname, actor || undefined);

    // Subscribe to route changes
    const unsubscribe = router.subscribe('onLoad', ({ toLocation }) => {
      trackPageView(toLocation.pathname, actor || undefined);
    });

    return unsubscribe;
  }, [router, actor]);

  // This component doesn't render anything
  return null;
}
