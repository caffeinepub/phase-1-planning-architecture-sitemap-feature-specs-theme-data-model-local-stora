/**
 * Lightweight analytics module supporting two modes:
 * 1. First-party logging via backend canister
 * 2. Optional Google Analytics-style script injection
 */

import type { backendInterface } from '../backend';

interface AnalyticsConfig {
  mode: 'first-party' | 'google-analytics' | 'none';
  trackingId?: string; // For Google Analytics
}

// Read config from environment or use defaults
const getConfig = (): AnalyticsConfig => {
  // Check for environment variables (set during build)
  const mode = (import.meta.env.VITE_ANALYTICS_MODE as string) || 'none';
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID as string;

  return {
    mode: mode as AnalyticsConfig['mode'],
    trackingId,
  };
};

const config = getConfig();

/**
 * Initialize analytics based on configuration
 */
export function initAnalytics(): void {
  if (config.mode === 'google-analytics' && config.trackingId) {
    injectGoogleAnalytics(config.trackingId);
  }
  // First-party mode requires no initialization (uses actor)
}

/**
 * Inject Google Analytics script asynchronously
 */
function injectGoogleAnalytics(trackingId: string): void {
  try {
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    
    // Add to head
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', trackingId);

    // Make gtag available globally
    (window as any).gtag = gtag;
  } catch (error) {
    console.error('Failed to inject Google Analytics:', error);
  }
}

/**
 * Track a pageview event
 */
export async function trackPageView(path: string, actor?: backendInterface): Promise<void> {
  if (config.mode === 'none') return;

  try {
    if (config.mode === 'first-party' && actor) {
      // Log to backend canister
      await actor.logEvent(`Pageview: ${path}`, 'info');
    } else if (config.mode === 'google-analytics' && (window as any).gtag) {
      // Send to Google Analytics
      (window as any).gtag('event', 'page_view', {
        page_path: path,
      });
    }
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug('Analytics tracking failed:', error);
  }
}

/**
 * Track a custom event
 */
export async function trackEvent(
  eventName: string,
  eventData?: Record<string, any>,
  actor?: backendInterface
): Promise<void> {
  if (config.mode === 'none') return;

  try {
    if (config.mode === 'first-party' && actor) {
      // Log to backend canister
      const message = eventData 
        ? `${eventName}: ${JSON.stringify(eventData)}`
        : eventName;
      await actor.logEvent(message, 'info');
    } else if (config.mode === 'google-analytics' && (window as any).gtag) {
      // Send to Google Analytics
      (window as any).gtag('event', eventName, eventData);
    }
  } catch (error) {
    console.debug('Analytics tracking failed:', error);
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
