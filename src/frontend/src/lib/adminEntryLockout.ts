/**
 * Admin entry lockout management with principal-keyed localStorage persistence
 * 
 * This module manages permanent lockout state for admin access attempts.
 * Lockout is tied to Internet Identity principals and persisted locally.
 */

import { getStorageItem, setStorageItem, removeStorageItem } from './localStorage';

const LOCKOUT_STORAGE_VERSION = 1;
const LOCKOUT_KEY_PREFIX = 'app_adminEntryLockout_';

/**
 * Generate a localStorage key for a specific principal
 */
function getLockoutKey(principalString: string): string {
  return `${LOCKOUT_KEY_PREFIX}${principalString}`;
}

/**
 * Check if a principal is locked out (synchronous, localStorage-backed)
 */
export function isAdminEntryLockedOut(principalString: string): boolean {
  const key = getLockoutKey(principalString);
  const locked = getStorageItem<boolean>(key, LOCKOUT_STORAGE_VERSION);
  return locked === true;
}

/**
 * Mark a principal as permanently locked out
 */
export function setAdminEntryLockedOut(principalString: string): void {
  const key = getLockoutKey(principalString);
  setStorageItem(key, true, { version: LOCKOUT_STORAGE_VERSION });
}

/**
 * Clear lockout state for a principal (admin recovery only)
 */
export function clearAdminEntryLockout(principalString: string): void {
  const key = getLockoutKey(principalString);
  removeStorageItem(key);
}

/**
 * Clear all cached lockout state (for identity changes)
 * Note: This does NOT remove stored flags, just clears any in-memory cache
 */
export function clearLockoutCache(): void {
  // Currently we don't have an in-memory cache, but this function
  // is here for future extensibility and to match the implementation plan
}
