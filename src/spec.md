# Specification

## Summary
**Goal:** Allow users to unlock and use the full admin dashboard via a backend-verified 5-character admin code, without requiring Internet Identity login.

**Planned changes:**
- Fix backend admin-code verification so that a case-insensitive “Access Granted” result also grants admin privileges to the same caller principal for subsequent admin-protected calls.
- Update `/admin-access` to remove any Internet Identity login requirement, enforce exactly 5-character input, submit the code to the backend, show “Access Granted” on success, and auto-redirect to the admin dashboard route.
- Update `/admin` route gating to rely on successful admin-code unlock (not Internet Identity): redirect locked users to `/admin-access`, and render the existing AdminDashboardShell and all current sections/tools once unlocked for the session.

**User-visible outcome:** A user can visit `/admin-access`, enter the 5-character code (e.g., `7583a`), see “Access Granted,” and be taken into the full admin dashboard at `/admin` with all existing features available—without any Internet Identity login.
