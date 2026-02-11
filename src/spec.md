# Specification

## Summary
**Goal:** Add persistent, canister-backed request moderation and a customer inbox so admins can review/approve requests, message customers (with large attachments), deliver coupons, and convert approved requests into orders.

**Planned changes:**
- Implement backend persistence and APIs for customer Requests: create (with optional media attachments), admin list, and admin fetch-by-id including attachment metadata and status.
- Add backend admin moderation actions for Requests (approve/decline) with immutable, timestamped action history and admin-only authorization.
- Implement backend customer inbox APIs for admin-to-customer messages and coupon deliveries, scoped per customer principal, persisted, and returned newest-first.
- Support message file attachments up to 800 MB using existing blob storage utilities, with inbox items linking stored blob references for customer download.
- Implement backend request-to-order conversion for admins, only allowed for approved requests, and persist link between Request and created Order.
- Upgrade Admin Dashboard Requests tab to load from backend, show request detail with attachment links/previews, allow approve/decline, send message/coupon to submitter, and convert approved requests to an order with success/error feedback.
- Add a customer-facing Inbox UI that lists messages/coupons and provides a manual Refresh control to refetch from the backend.
- Ensure all admin-only operations use the existing admin/owner role system and work for any principal in the admin registry (not only owner).

**User-visible outcome:** Customers can submit requests and later view admin messages/coupons in an Inbox (with manual refresh and downloadable attachments). Admins can view and moderate all requests with attachments, message customers (including large files), send coupons, and convert approved requests into orders.
