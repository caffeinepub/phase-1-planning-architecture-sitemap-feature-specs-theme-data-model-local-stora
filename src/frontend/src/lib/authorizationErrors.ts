/**
 * Authorization error handling utilities for consistent user-facing messages
 */

export function normalizeAuthorizationError(error: any): string {
  if (!error) return 'An unknown error occurred';

  const errorMessage = error.message || error.toString();

  // Check for common authorization error patterns
  if (errorMessage.includes('Unauthorized')) {
    return 'You do not have permission to perform this action';
  }

  if (errorMessage.includes('Only the owner')) {
    return 'This action is restricted to the owner';
  }

  if (errorMessage.includes('Only admins')) {
    return 'This action requires admin privileges';
  }

  if (errorMessage.includes('Cannot modify owner')) {
    return 'Owner permissions cannot be modified';
  }

  if (errorMessage.includes('Cannot demote the owner')) {
    return 'The owner cannot be demoted';
  }

  if (errorMessage.includes('Cannot remove owner status')) {
    return 'Owner status cannot be removed';
  }

  if (errorMessage.includes('Actor not available')) {
    return 'Connection to backend is not available. Please try again.';
  }

  // Return the original message if no pattern matches
  return errorMessage;
}

export function isAuthorizationError(error: any): boolean {
  if (!error) return false;
  const errorMessage = error.message || error.toString();
  return errorMessage.includes('Unauthorized') || 
         errorMessage.includes('Only the owner') || 
         errorMessage.includes('Only admins');
}
