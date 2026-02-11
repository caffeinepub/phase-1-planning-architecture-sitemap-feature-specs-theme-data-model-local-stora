# Specification

## Summary
**Goal:** Add a secure Admin Access gateway page that verifies a five-character master code, routes authorized users into the existing Admin Dashboard for the current session, and records successful access events for audit.

**Planned changes:**
- Add a protected Admin Access Page at `/admin-access` with a single 5-character input to verify master code `7583A`; on success unlock admin access for the current browser session and route to `/admin`, and on failure show only “Access Denied”.
- Update responsive header navigation to include an “Admin” link to `/admin-access` in both desktop top navigation and the mobile hamburger menu, without replacing existing links/behavior.
- Ensure `/admin` remains gated so it cannot be viewed unless admin access has been unlocked in the current session; redirect/prevent rendering otherwise, while keeping the existing Admin Dashboard intact.
- Update backend verification to persist an Admin Access Log entry for successful verifications (unique id, caller principal, real timestamp) and keep/provide an admin-only endpoint to query the log.
- Ensure logout clears the session-scoped “admin access unlocked” state so the master code must be re-entered after logging out/logging back in.

**User-visible outcome:** Users can navigate to `/admin-access` (or via the new “Admin” nav link), enter the five-character code to access `/admin` for the current session, and see only “Access Denied” when the code is incorrect; successful entries are recorded for admin-only auditing.
