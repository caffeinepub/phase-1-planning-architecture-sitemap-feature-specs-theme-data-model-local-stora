# Specification

## Summary
**Goal:** QA and debug the full site, fix navigation/route mismatches, and ensure the Admin access flow reliably redirects to a working Admin Dashboard.

**Planned changes:**
- Perform a full-site audit to fix runtime/console errors, broken routes/links, layout overlaps, responsive styling issues, and JS/script conflicts across all pages and components.
- Align header and footer navigation links with the actual router paths, including ensuring “Lore & Knowledge” and footer “Lore” both load the Lore page content (BlogLore).
- Update header navigation (desktop + mobile hamburger menu) to include a clearly labeled “Admin” item that routes to `/admin-access`, while preserving existing lockout behavior and ensuring the mobile menu closes after selection.
- Update the Admin access screen copy and flow: label “Administrator Access”, button “Submit”, accept code `7583A` (case-insensitive), show “Access Granted”, and redirect immediately to `/admin` with no artificial delay.
- Stabilize `/admin` so Admin Dashboard sections render without crashes/blank states/errors, and prevent redirect loops related to admin gating/verification; keep backend verification behavior consistent (accept code `7583A` case-insensitive and return “Access Granted”).
- Run the existing manual QA checklist (navigation & mobile menu, admin access, core pages) and fix issues found, including responsive regressions and functional keyboard/focus issues.

**User-visible outcome:** Users can navigate every page without errors or broken links, the mobile menu works reliably, “Lore & Knowledge” loads the correct Lore content, and selecting “Admin” allows entering the access code to immediately reach a stable, usable Admin Dashboard.
