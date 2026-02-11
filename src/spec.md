# Specification

## Summary
**Goal:** Add a two-step admin entry gate (Internet Identity admin role + master access code) with backend verification and persistent audit logging, and complete the unified single-actor backend so existing frontend admin/customer workflows function end-to-end.

**Planned changes:**
- Add a new Admin Access page/route (e.g., `/admin-access`) that requires entering the master access code `7583A` before allowing access to the existing admin dashboard at `/admin`.
- Gate the `/admin` route so admins who haven’t successfully entered the master code in the current session are redirected/blocked and guided to the Admin Access page.
- Implement backend methods in the single Motoko actor (`backend/main.mo`) to verify the master code for admin principals only, persist a successful-login audit entry (principal + timestamp), and provide an admin-only query to list these audit log entries.
- Wire the Admin Access page to call the backend verification method; store the unlocked state in session-scoped browser storage so refreshes don’t re-lock during the same session, and clear this unlocked state on explicit logout.
- Ensure unified backend coverage for requests, testimonies, messages/inbox, coupons, and orders in `backend/main.mo` so the frontend’s existing React Query hooks and admin UI flows work with consistent method shapes and workflows.
- Update admin entry UX messaging (English) to clearly communicate the two-step security requirement, while avoiding edits to immutable frontend paths by using new pages/components and composition.

**User-visible outcome:** Admins must log in with Internet Identity, then enter the master access code `7583A` to access the admin dashboard; successful unlocks are recorded and viewable via an admin-only audit log, and the existing admin/customer workflows for requests, inbox/messages, coupons, testimonies, and orders work through the unified backend.
