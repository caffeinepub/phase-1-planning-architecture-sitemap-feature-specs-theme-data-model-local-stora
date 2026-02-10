/**
 * Centralized local storage utility with versioning, expiry, and safe error handling
 */

interface StorageItem<T> {
  version: number;
  data: T;
  createdAt: number;
  expiresAt?: number;
}

interface StorageOptions {
  expiresIn?: number; // milliseconds
  version?: number;
}

const DEFAULT_VERSION = 1;

/**
 * Safely get an item from localStorage with version and expiry checking
 */
export function getStorageItem<T>(key: string, expectedVersion: number = DEFAULT_VERSION): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed: StorageItem<T> = JSON.parse(item);

    // Check version
    if (parsed.version !== expectedVersion) {
      console.warn(`Storage version mismatch for ${key}. Expected ${expectedVersion}, got ${parsed.version}`);
      removeStorageItem(key);
      return null;
    }

    // Check expiry
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      removeStorageItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set an item in localStorage with version and optional expiry
 */
export function setStorageItem<T>(key: string, data: T, options: StorageOptions = {}): boolean {
  try {
    const { expiresIn, version = DEFAULT_VERSION } = options;
    
    const item: StorageItem<T> = {
      version,
      data,
      createdAt: Date.now(),
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
    };

    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    
    // Handle quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, attempting to clear expired items');
      clearExpiredItems();
      
      // Try again after clearing
      try {
        const item: StorageItem<T> = {
          version: options.version || DEFAULT_VERSION,
          data,
          createdAt: Date.now(),
          expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined,
        };
        localStorage.setItem(key, JSON.stringify(item));
        return true;
      } catch (retryError) {
        console.error('Failed to write to localStorage even after clearing:', retryError);
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

/**
 * Clear all expired items from localStorage
 */
export function clearExpiredItems(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const item = localStorage.getItem(key);
        if (!item) continue;

        const parsed: StorageItem<any> = JSON.parse(item);
        if (parsed.expiresAt && now > parsed.expiresAt) {
          keysToRemove.push(key);
        }
      } catch {
        // Skip invalid items
      }
    }

    keysToRemove.forEach(key => removeStorageItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} expired items from localStorage`);
    }
  } catch (error) {
    console.error('Error clearing expired items:', error);
  }
}

/**
 * Clear all session-scoped storage items
 */
export function clearSessionStorage(): void {
  try {
    const sessionKeys = ['app_sessionState_v1', 'app_offlineDrafts_v1'];
    sessionKeys.forEach(key => removeStorageItem(key));
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}

/**
 * Clear all app storage (nuclear option)
 */
export function clearAllStorage(): void {
  try {
    const appKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('app_')) {
        appKeys.push(key);
      }
    }
    
    appKeys.forEach(key => removeStorageItem(key));
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
