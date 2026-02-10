# Specification

## Summary
**Goal:** Add owner-only Admin+ controls backed by persistent owner/admin role configuration, including shop-wide safety switches, product overrides, coupon master switch, admin management, and an analytics snapshot.

**Planned changes:**
- Add persistent backend owner configuration (single stored owner Principal) with strict owner-only authorization helpers and owner-only get/set owner methods.
- Introduce a backend admin registry keyed by Principal with role flags (Admin/Owner) used for promotions/demotions and role checks, independent of user profile records (including upgrade-safe migration if needed).
- Expand the Admin+ page (owner-only) to include sections for: change admin passwords, promote/demote admins, product pricing overrides, forced stock state overrides (in-stock/out-of-stock/hidden), global coupons enable/disable, emergency shop disable switch, and site analytics snapshot.
- Implement an emergency shop disable feature flag: owner-only toggle in backend; frontend storefront/checkout UI hidden when disabled; backend order creation blocked with a clear English error.
- Implement per-product price override storage and owner-only set/clear/read methods; ensure public product queries return effective price (override or base).
- Implement per-product forced stock state overrides (including hidden) with owner-only controls; ensure public product queries exclude hidden items and reflect effective availability.
- Implement a global coupons enabled/disabled flag with owner-only get/set; ensure coupon validation/application is blocked when disabled (including in `createOrder`).
- Add owner-only admin management endpoints and UI for listing/promoting/demoting admin principals with clear English feedback and query invalidation.
- Add owner-only admin password reset/set capability in backend and Admin+ UI; ensure password verification is enforced by the backend for admin-only capabilities (or a defined subset).
- Add an owner-only analytics snapshot endpoint derived from orders and display it in Admin+ with loading/error states.

**User-visible outcome:** The configured site owner can access an expanded Admin+ area to manage admins and admin passwords, toggle emergency shop shutdown, globally enable/disable coupons, override product pricing and stock visibility, and view a basic analytics snapshot; customers see the shop hidden and cannot place orders when the shop is disabled, and product pricing/availability/coupon behavior reflects the owner’s overrides.
