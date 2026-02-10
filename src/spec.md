# Specification

## Summary
**Goal:** Update the /about page to reflect “The Creator of Side Quests” and show 2–3 randomized, non-repeating user-provided quotes on every page (including About), while restoring a successful build/deploy.

**Planned changes:**
- Replace the existing /about content with the user-provided “The Creator of Side Quests” narrative, formatted as polished, multi-paragraph website copy while keeping the provided text verbatim.
- Update the /about page title/description to match “The Creator of Side Quests” and remove any remaining “Arcane Artifacts” branding from the About page.
- Ensure Mission Statement and Vision Statement appear clearly labeled on /about and match the user-provided wording exactly.
- Update the centralized quotes data source to include exactly the 10 user-provided quotes (unchanged wording/punctuation).
- Update the random quote selection utility to return 2–3 quotes per page render/load with no repeats within the same render.
- Render the randomized quotes on all existing routes (/, /services, /shop, /dashboard, /contact, /blog, /faq, /terms, /privacy, /admin, and /about) in a consistent, unobtrusive pull-quote/card style that remains mobile-safe.
- Resolve build/typecheck/deploy failures introduced by the prior attempt, without modifying any frontend immutable paths or files under frontend/src/components/ui.

**User-visible outcome:** Visitors see the updated “The Creator of Side Quests” About page and 2–3 randomly selected (non-repeating) quotes displayed tastefully on every page, with the app building and running without errors.
