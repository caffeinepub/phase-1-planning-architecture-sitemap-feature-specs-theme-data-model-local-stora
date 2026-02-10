# Specification

## Summary
**Goal:** Produce Phase 1 planning/architecture docs and scaffold a themed multi-page frontend with IC-native data model placeholders and a documented local storage strategy.

**Planned changes:**
- Add Phase 1 planning document with full sitemap/page list, purpose per page, navigation structure, and access notes (public vs authenticated vs admin-only).
- Implement frontend route/page skeletons for: Homepage, About, Services, Shop, Dashboard, Contact, Blog/Lore, FAQ, Admin, Terms, Privacy; include global navigation and footer links to Terms/Privacy.
- Add a Phase 1 features-by-page specification documenting intended features per page (including hover effects, flip cards, filters, inventory syncing) and tag each as Phase 1 (spec/skeleton) vs later.
- Define and apply a consistent dark fantasy design direction (parchment tones + subtle glowing accents) via a small design system (colors, typography, spacing, buttons/hover, cards) across global layout and all pages.
- Create an IC canister-native data architecture plan mapping “tables” (Users, Inventory, Products, Orders, Saved Artifacts, etc.) to Motoko entities/relationships and implement corresponding Motoko types + placeholder storage in a single backend actor.
- Implement a versioned, centralized frontend local storage utility/hooks for recently viewed items, offline drafts, and session state; document keys and retention/expiry; demonstrate recently viewed on at least one page (e.g., Shop).
- Add generated static theme-matching visual assets under `frontend/public/assets/generated` and reference them in the global UI with graceful fallbacks.

**User-visible outcome:** Users can navigate to all planned pages via a consistent dark-fantasy themed UI, see clear page titles/placeholder sections, and the project includes Phase 1 docs for sitemap, features, design direction, data architecture, and local storage; the app also shows basic usage of “recently viewed” storage and includes themed static assets.
