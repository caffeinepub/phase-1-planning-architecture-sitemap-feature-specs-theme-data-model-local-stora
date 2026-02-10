# Specification

## Summary
**Goal:** Enable logged-in customers to submit Requests and Testimonies (with media), assign unique IDs, display interactive testimony media cards publicly, and let admins list/review all submissions in the admin dashboard.

**Planned changes:**
- Add backend models and actor APIs for creating Requests and Testimonies with unique, non-zero IDs, plus admin-only list methods with consistent ordering.
- Enforce backend authorization: only authenticated users can submit; only admins can access listing/review endpoints.
- Add media attachment support using existing blob storage mixin: optional media for Requests; up to 5 photos and 3 videos for Testimonies, storing media metadata and per-item descriptions (≤1,500 chars).
- Create frontend routes/forms for submitting a Request and submitting a Testimony, gated behind existing RequireAuth behavior; prefill name/email from profile when available.
- Add navigation and page entry points: main nav links, testimonies page CTA for logged-in users, and at least one non-intrusive CTA in Services/Shop routing to Request submission.
- Implement the Testimonies page to render media as interactive flippable cards using the existing FlipCard component: video hover preview (muted) and pause-on-flip; photo hover zoom and flip-to-description; respect reduced-motion preference.
- Extend the admin dashboard (/admin) to list Requests and Testimonies with unique IDs and key metadata, and refresh lists after successful submissions via React Query invalidation/refetch.
- Add React Query hooks for create/list operations for Requests/Testimonies following existing actor-based query patterns.
- If required by schema changes, add a conditional backend migration preserving existing data and ensuring ID counters do not collide/reset.

**User-visible outcome:** Logged-in users can submit Requests and Testimonies (including media uploads with limits), browse a Testimonies page with interactive media cards, and admins can view up-to-date lists of all submissions (with unique IDs) in the admin dashboard.
