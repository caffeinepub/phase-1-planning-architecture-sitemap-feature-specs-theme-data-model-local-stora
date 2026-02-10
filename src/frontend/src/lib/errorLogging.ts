/**
 * Privacy-minimal client-side error logging utilities
 * Stores errors locally for troubleshooting without sending data externally
 */

const ERROR_LOG_KEY = 'arcane_error_log_v1';
const MAX_LOG_ENTRIES = 50;

export interface ErrorLogEntry {
  timestamp: number;
  route?: string;
  message: string;
  stack?: string;
  userAgent?: string;
}

/**
 * Safely read error log from localStorage
 */
export function readErrorLog(): ErrorLogEntry[] {
  try {
    const stored = localStorage.getItem(ERROR_LOG_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to read error log:', error);
    return [];
  }
}

/**
 * Write error entry to localStorage with size limit
 */
export function writeErrorLog(entry: Omit<ErrorLogEntry, 'timestamp'>): void {
  try {
    const log = readErrorLog();
    
    const newEntry: ErrorLogEntry = {
      timestamp: Date.now(),
      ...entry,
    };
    
    // Add new entry and keep only most recent MAX_LOG_ENTRIES
    log.unshift(newEntry);
    const trimmedLog = log.slice(0, MAX_LOG_ENTRIES);
    
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmedLog));
  } catch (error) {
    console.error('Failed to write error log:', error);
  }
}

/**
 * Clear all error log entries
 */
export function clearErrorLog(): void {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
  } catch (error) {
    console.error('Failed to clear error log:', error);
  }
}

/**
 * Get current route path (safe for use outside React)
 */
export function getCurrentRoute(): string | undefined {
  try {
    return window.location.pathname;
  } catch {
    return undefined;
  }
}

/**
 * Sanitize error message to remove sensitive data
 */
export function sanitizeErrorMessage(message: string): string {
  // Remove potential sensitive data patterns
  return message
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[email]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn]')
    .replace(/\b\d{16}\b/g, '[card]')
    .substring(0, 500); // Limit message length
}
