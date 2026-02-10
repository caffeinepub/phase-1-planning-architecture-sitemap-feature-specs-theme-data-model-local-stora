# Specification

## Summary
**Goal:** Add Portfolio and Testimonies preview widgets with navigation access, enhance Shop product creation and display with richer product fields, and enable public testimony submissions with admin moderation.

**Planned changes:**
- Add responsive Portfolio widget sections to the Homepage and Services pages with a preview/teaser and a link to the full Portfolio page (/portfolio).
- Add responsive Testimonies widget sections to the Homepage and Services pages with a preview/teaser and a link to the full Testimonies page (/testimonies).
- Update main navigation to include Shop (/shop), Portfolio (/portfolio), and Testimonies (/testimonies) links on desktop (top-right) and in the mobile hamburger menu.
- Extend backend Product model and APIs to store/return: product image, custom price, stock status (in/out), availability (delivery/pickup/drop-off), and short description; ensure admin-only creation persists these fields and shop listings return them.
- Update Admin Dashboard “Create Product” UI to collect the new fields (including image upload) and publish products so they appear on the public Shop page immediately, with React Query refetch/invalidation and user-friendly validation/errors.
- Render public Shop products as flippable cards using the existing FlipCard component, showing image/name/price/stock on the front and description/availability plus a CTA on the back, preserving existing flows and accessibility behavior.
- Add a public “Create Testimony” flow on the Testimonies page to submit review text (max 800 chars), 1–5 star rating, and photo/video uploads, and refresh the public list after submission.
- Apply consistent star rating styling across the app: filled stars use a golden moss-green tone with a glow; unfilled stars remain subdued and accessible.
- Add backend testimony creation for customers and admin-only removal/moderation; ensure public testimonies queries exclude removed items.
- Add an Admin Dashboard “Testimony Management” section for admins to review and remove testimonies, with immediate UI updates (or queued/offline messaging if applicable) while keeping existing owner-only Admin+ behavior unchanged.
- Add conditional backend migration logic if needed so existing stored products/testimonies/portfolios remain readable after schema changes and upgrades do not trap, with sensible defaults for new fields.

**User-visible outcome:** Visitors can preview and navigate to Portfolio and Testimonies from key pages and the main nav; admins can create richer Shop products that instantly appear as flippable cards on the Shop page; customers can submit testimonies with ratings and media, and admins can moderate/remove inappropriate submissions so removed items no longer appear publicly.
