/**
 * Session-scoped admin access gate management
 * Stores whether the admin has successfully entered the master access code
 * Cleared on logout or browser session end
 */

const ADMIN_ACCESS_KEY = 'admin_access_unlocked';

/**
 * Check if admin access is unlocked for the current session
 */
export function isAdminAccessUnlocked(): boolean {
  try {
    const value = sessionStorage.getItem(ADMIN_ACCESS_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading admin access state:', error);
    return false;
  }
}

/**
 * Set admin access as unlocked for the current session
 */
export function setAdminAccessUnlocked(): void {
  try {
    sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
  } catch (error) {
    console.error('Error setting admin access state:', error);
  }
}

/**
 * Clear admin access unlock state
 */
export function clearAdminAccessUnlocked(): void {
  try {
    sessionStorage.removeItem(ADMIN_ACCESS_KEY);
  } catch (error) {
    console.error('Error clearing admin access state:', error);
  }
}
