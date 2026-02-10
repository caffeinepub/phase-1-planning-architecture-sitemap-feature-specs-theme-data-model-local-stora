import { useEffect } from 'react';
import { writeErrorLog, getCurrentRoute, sanitizeErrorMessage } from '../lib/errorLogging';

/**
 * Hook that registers global error handlers for runtime errors and unhandled promise rejections
 */
export function useGlobalErrorCapture() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const message = sanitizeErrorMessage(event.message || 'Unknown error');
      const stack = event.error?.stack?.substring(0, 1000); // Limit stack trace length
      
      writeErrorLog({
        route: getCurrentRoute(),
        message,
        stack,
        userAgent: navigator.userAgent.substring(0, 200),
      });
      
      // Don't prevent default error handling
      return false;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = sanitizeErrorMessage(
        reason?.message || reason?.toString() || 'Unhandled promise rejection'
      );
      const stack = reason?.stack?.substring(0, 1000);
      
      writeErrorLog({
        route: getCurrentRoute(),
        message: `Promise rejection: ${message}`,
        stack,
        userAgent: navigator.userAgent.substring(0, 200),
      });
    };

    // Register handlers
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
