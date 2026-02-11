# Specification

## Summary
**Goal:** Add customer-facing order tracking in the Dashboard and admin-controlled tracking management, including statuses, timestamped history, manual location updates, and admin-authored pop-up notes.

**Planned changes:**
- Extend the backend order model to store: tracking status (pending, processing, ready for pickup, out for delivery, completed), timestamped status-change history, manual admin-entered location updates with timestamps, admin-authored pop-up notes with timestamps, and a fulfillment method (delivery/pickup/drop-off) labeled as Ashland/Westwood Kentucky area-specific for pickup/drop-off.
- Add admin-only backend methods to update tracking status, add a location update, and add a pop-up note; each change appends an immutable timestamped entry.
- Update existing backend order read APIs so customer and admin order lists include all tracking data needed by the UI (current status, derived next status, histories, location updates, pop-up notes, fulfillment method), visible on refresh (no real-time push).
- Update the customer Dashboard to display per-order tracking: current status, next status as locked/preview until advanced by an admin, status-change timestamps/history, latest admin pop-up note(s), and manual location updates with timestamps.
- Enhance the admin orders UI to allow per-order tracking updates (status, location update, pop-up note) and refetch/invalidate data after mutations, with basic client-side validation for empty inputs.

**User-visible outcome:** Customers can track their orders from the Dashboard with clear status progression, timestamps, location updates, and admin notes; admins can manage and post these tracking updates from the admin orders area, with changes appearing after refresh/refetch.
