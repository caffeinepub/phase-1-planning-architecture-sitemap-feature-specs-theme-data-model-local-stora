/**
 * Frontend admin access code utilities
 * Used for lightweight client-side normalization and format validation
 * Backend remains the authoritative source for access control
 */

/**
 * Normalize access code input: trim whitespace and convert to uppercase
 */
export function normalizeAccessCode(input: string): string {
  return input.trim().toUpperCase();
}

/**
 * Lightweight client-side format validation (not a security check)
 * Always call backend for authoritative decision
 */
export function isValidCodeFormat(input: string): boolean {
  const normalized = normalizeAccessCode(input);
  return normalized.length === 5;
}
