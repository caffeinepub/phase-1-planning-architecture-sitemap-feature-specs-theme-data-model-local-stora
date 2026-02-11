# Specification

## Summary
**Goal:** Make “7583A” a permanent master admin code that always grants access, bypasses lockouts, and redirects users to the Admin Dashboard on success.

**Planned changes:**
- Backend: Treat “7583A” as a permanent master admin code that always returns “Access Granted” (including when locked out), and clears/resets any lockout/attempt counters on success.
- Backend: Normalize master-code input by trimming whitespace and comparing case-insensitively, while still requiring a five-character code after trimming.
- Frontend: On the Admin Access page, ensure entering the master code shows “Access Granted” and auto-redirects to “/admin” without ever showing an access-denied state for that input (including normalized variants).
- Frontend: Update admin settings UI copy to clearly state “7583A” is permanent and cannot be changed; describe the existing update form as changing only a configurable/secondary admin access code (English text only).

**User-visible outcome:** Users can enter “7583A” (even with surrounding spaces or different casing) to always get “Access Granted” and be automatically taken to “/admin”, and the settings UI clearly distinguishes the permanent master code from the configurable admin access code.
