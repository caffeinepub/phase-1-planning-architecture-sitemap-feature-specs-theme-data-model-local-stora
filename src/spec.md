# Specification

## Summary
**Goal:** Add a public/admin testimony approval workflow, introduce a Search Artifacts experience that indexes testimonies with controlled discoverability, and ensure the site is responsive across devices.

**Planned changes:**
- Add testimony status lifecycle: new submissions appear publicly immediately but are labeled “Awaiting Admin Verification” until an admin approves them.
- Extend backend storage and APIs to support admin-only testimony approval/verification, persist status changes, and record approval actions in the existing audit log.
- Update Admin Testimonies UI to show status (Pending vs Verified/Approved) and provide an approve action that refreshes admin/public views via React Query invalidation.
- Create a Search Artifacts system (UI + backend query support) with keyword search and category filtering, including a “Testimonies” category.
- Automatically index testimonies into Search Artifacts using testimony title/description and media description text so new submissions become searchable without manual entry.
- Enforce controlled discoverability so testimonies only appear publicly on the Testimonies page and in Search Artifacts results (admin views excluded from this restriction).
- Implement responsive layout improvements across all pages, navigation, dashboards, forms, testimonies, and media upload components for mobile/tablet/desktop/large screens.

**User-visible outcome:** Users can submit testimonies that appear immediately with an “Awaiting Admin Verification” label until approved; admins can review and approve testimonies in the dashboard; users can search for testimonies via a new Search Artifacts page with filtering; and the entire site works cleanly on common screen sizes without overflow or unusable UI.
