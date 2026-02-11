# Specification

## Summary
**Goal:** Expand the post-login admin experience into a single control-center dashboard with additional management tabs (Messaging, Coupons, Analytics, System Settings) while keeping existing sections unchanged.

**Planned changes:**
- Update `/admin` so that, after Internet Identity login + successful Admin Access unlock, admins see one dashboard UI with navigation for: Requests, Orders, Testimonies, Messaging, Coupons, Analytics, and System Settings.
- Add a Messaging tab for admins to review customer inbox items/threads and send admin-to-customer messages (including attachments when supported by existing attachment UI components).
- Add a Coupons tab to list coupons, create coupons, toggle coupon validity, and (when supported by existing workflows) send coupons to customers in a way that produces a customer inbox item.
- Add an Analytics tab that shows an analytics snapshot with clear loading/error states and a manual refresh action.
- Add a System Settings tab that centralizes system status and available audit data, and enforces admin/owner-only restrictions for sensitive actions with explicit English messaging.
- Add/verify backend canister methods required by the new tabs, ensuring all admin-only endpoints are gated appropriately and return stable types consumable by the frontend.

**User-visible outcome:** After logging in and unlocking Admin Access, an admin can use a unified `/admin` control center to navigate existing Requests/Orders/Testimonies and also manage Messaging, Coupons, Analytics, and System Settings with consistent states and permissions.
