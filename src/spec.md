# Specification

## Summary
**Goal:** Regenerate a reliable admin access system with a persisted master code and a fully functional Admin Dashboard (including settings to change the code), all styled consistently with the existing site.

**Planned changes:**
- Persist the master admin access code in backend canister state (default to "7583A" on fresh deploy) and validate admin access against the persisted value.
- Add backend admin settings API to update the master admin access code (authorized admins only) and persist the change.
- Ensure site navigation “Admin” entry points (header and mobile menu) route to `/admin-access` and match existing nav styling.
- Implement Admin Access flow: correct code shows “Access Granted” then redirects to `/admin`; incorrect code shows denied/invalid message without redirect.
- Add an Admin Settings section in the Admin Dashboard UI to change the master admin access code via the backend API (English text only).
- Regenerate/wire up Admin Dashboard tools end-to-end (frontend to backend) for coupon management, testimonies review/verification, portfolio photo/video uploads, and shop product management, following existing permission gating and site theme.

**User-visible outcome:** Users can navigate to `/admin-access`, enter the current master code to gain access (with an “Access Granted” confirmation and automatic redirect), and authorized admins can use a themed Admin Dashboard to manage coupons, testimonies, portfolio uploads, products, and update the master admin code.
