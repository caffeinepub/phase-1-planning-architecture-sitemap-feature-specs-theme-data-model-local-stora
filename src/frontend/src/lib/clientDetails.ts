/**
 * Client details utility for capturing browser and device information
 * Used for admin access logging and security tracking
 */

export interface ClientDetails {
  browserInfo: string;
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown';
}

/**
 * Captures browser user agent and derives device type
 * Safe for SSR/undefined window scenarios
 */
export function getClientDetails(): ClientDetails {
  // Handle SSR or missing window
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      browserInfo: 'unknown',
      deviceType: 'unknown',
    };
  }

  const userAgent = navigator.userAgent || 'unknown';
  const deviceType = deriveDeviceType(userAgent);

  return {
    browserInfo: userAgent,
    deviceType,
  };
}

/**
 * Derives device type from user agent string
 */
function deriveDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' | 'unknown' {
  if (!userAgent || userAgent === 'unknown') {
    return 'unknown';
  }

  const ua = userAgent.toLowerCase();

  // Check for tablet first (more specific)
  if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }

  // Check for mobile
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }

  // Default to desktop
  return 'desktop';
}
