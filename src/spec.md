# Specification

## Summary
**Goal:** Make the Contact page social-media bubbles open the user’s provided social profile URLs in a new tab, with clearly clickable bubble hit areas and accessible hover/focus states.

**Planned changes:**
- Update the Facebook, YouTube, TikTok, and Instagram bubble links in `frontend/src/pages/Contact.tsx` to use the exact provided URLs.
- Ensure each social icon link is a circular, comfortably tappable “bubble” with visible hover and keyboard focus styles, proper `aria-label`s, and safe new-tab behavior (`target="_blank"` + `rel="noopener noreferrer"`).

**User-visible outcome:** On the Contact page, clicking (or keyboard-focusing and activating) each social-media bubble reliably opens the corresponding provided social profile in a new tab, and the bubbles look/feel clearly interactive.
