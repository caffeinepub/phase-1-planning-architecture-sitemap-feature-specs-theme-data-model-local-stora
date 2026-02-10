# Phase 6 QA Test Plan - Arcane Artifacts

## Overview
This document provides comprehensive manual test cases for all core user flows in the Arcane Artifacts application. Tests cover guest, authenticated user, and admin scenarios across multiple browsers and devices.

## Test Environment Matrix

### Desktop Browsers
- Chrome (latest stable)
- Firefox (latest stable)
- Safari (latest stable)
- Edge (latest stable)

### Mobile Devices
- iOS Safari (latest)
- Android Chrome (latest)

## Core Test Scenarios

### 1. Internet Identity Authentication

#### Test Case 1.1: User Login
**Prerequisites:** None (guest user)
**Steps:**
1. Navigate to homepage
2. Click "Login" button in header
3. Complete Internet Identity authentication flow
4. Verify redirect back to application

**Expected Results:**
- Login button changes to "Logout"
- User principal is authenticated
- Dashboard link appears in navigation
- No profile setup modal if user has existing profile
- Profile setup modal appears if first-time user

**Test on:** All browsers and devices

#### Test Case 1.2: User Logout
**Prerequisites:** Authenticated user
**Steps:**
1. Click "Logout" button in header
2. Confirm logout action

**Expected Results:**
- User is logged out
- Login button reappears
- Dashboard link removed from navigation
- All cached user data cleared
- Redirect to homepage

**Test on:** All browsers and devices

#### Test Case 1.3: Profile Setup (First-Time User)
**Prerequisites:** New authenticated user without profile
**Steps:**
1. Log in with new Internet Identity
2. Profile setup modal appears
3. Enter name and email
4. Submit profile

**Expected Results:**
- Modal appears immediately after login
- Form validation works correctly
- Profile saved successfully
- Modal closes after submission
- User name displayed in dashboard

**Test on:** All browsers and devices

### 2. Role-Based Access Control

#### Test Case 2.1: Guest Access
**Prerequisites:** Not logged in
**Steps:**
1. Navigate to homepage, about, services, shop, blog, FAQ, contact
2. Attempt to access /dashboard
3. Attempt to access /admin

**Expected Results:**
- Public pages accessible
- Shop products visible
- Dashboard shows login prompt or redirects
- Admin page shows access denied or redirects
- No errors in console

**Test on:** Chrome, Firefox, Safari

#### Test Case 2.2: Authenticated User Access
**Prerequisites:** Logged in as regular user (non-admin)
**Steps:**
1. Navigate to all public pages
2. Access /dashboard
3. Attempt to access /admin

**Expected Results:**
- All public pages accessible
- Dashboard accessible with all user tabs
- Admin page shows "Access Denied" screen
- No admin link in navigation

**Test on:** Chrome, Firefox, Safari

#### Test Case 2.3: Admin Access
**Prerequisites:** Logged in as admin user
**Steps:**
1. Navigate to all pages including /admin
2. Verify admin link in navigation
3. Access all admin tabs (Products, Orders, Users)

**Expected Results:**
- All pages accessible
- Admin link visible in navigation
- Admin panel fully functional
- All admin operations work correctly

**Test on:** Chrome, Firefox

### 3. Shop & Product Management

#### Test Case 3.1: Browse Products (Guest)
**Prerequisites:** None
**Steps:**
1. Navigate to /shop
2. View product grid
3. Switch to list view
4. Use search filter
5. Click product to view details

**Expected Results:**
- Products load and display correctly
- Grid/list toggle works
- Search filters products in real-time
- Product modal opens with full details
- Modal scrollable on mobile
- Close button works reliably

**Test on:** All browsers and devices

#### Test Case 3.2: Add to Cart (Local)
**Prerequisites:** None (works for guests)
**Steps:**
1. Open product details modal
2. Click "Add to Cart"
3. Navigate to dashboard (login if needed)
4. View cart in Inventory tab

**Expected Results:**
- Toast confirmation appears
- Cart persists across page refreshes
- Cart count accurate
- Product details correct in cart

**Test on:** Chrome, Firefox, Safari, iOS Safari

#### Test Case 3.3: Save Artifact (Authenticated)
**Prerequisites:** Logged in user
**Steps:**
1. Open product details modal
2. Click "Save" button (heart icon)
3. Navigate to dashboard
4. View Saved Artifacts tab

**Expected Results:**
- Toast confirmation appears
- Heart icon fills with gold color
- Artifact appears in Saved Artifacts
- Unsave works correctly

**Test on:** Chrome, Firefox, Safari

#### Test Case 3.4: Save Artifact (Offline)
**Prerequisites:** Logged in user, offline mode
**Steps:**
1. Disconnect from network
2. Open product details modal
3. Click "Save" button
4. Reconnect to network
5. Wait for sync

**Expected Results:**
- Action queued with toast notification
- Offline sync status shows "Syncing"
- Action replays when online
- Artifact appears in Saved Artifacts after sync

**Test on:** Chrome, Firefox

### 4. Checkout & Order Creation

#### Test Case 4.1: Checkout Flow
**Prerequisites:** Items in cart, logged in
**Steps:**
1. Navigate to Dashboard > Inventory
2. Adjust quantities if needed
3. Review total amount
4. Click "Checkout"

**Expected Results:**
- Order created successfully
- Cart cleared after checkout
- Order appears in Orders tab
- Toast confirmation shown

**Test on:** All browsers

#### Test Case 4.2: Checkout (Offline)
**Prerequisites:** Items in cart, logged in, offline
**Steps:**
1. Disconnect from network
2. Navigate to Dashboard > Inventory
3. Click "Checkout"
4. Reconnect to network

**Expected Results:**
- Checkout queued for sync
- Toast notification about offline queue
- Order created when back online
- Cart cleared after successful sync

**Test on:** Chrome, Firefox

### 5. Admin Operations

#### Test Case 5.1: Create Product
**Prerequisites:** Admin user
**Steps:**
1. Navigate to Admin > Products
2. Fill in product form (name, description, price, stock)
3. Click "Create Product"

**Expected Results:**
- Form validation works
- Product created successfully
- Product appears in list immediately
- Product visible in shop

**Test on:** Chrome, Firefox

#### Test Case 5.2: Edit Product
**Prerequisites:** Admin user, existing product
**Steps:**
1. Navigate to Admin > Products
2. Click "Edit" on a product
3. Modify fields
4. Click "Save Changes"

**Expected Results:**
- Form pre-filled with current values
- Changes saved successfully
- Product list updates
- Changes visible in shop

**Test on:** Chrome, Firefox

#### Test Case 5.3: Update Stock
**Prerequisites:** Admin user, existing product
**Steps:**
1. Navigate to Admin > Products
2. Find product with stock input
3. Change stock value
4. Click "Update Stock"

**Expected Results:**
- Stock updated immediately
- Toast confirmation
- Shop reflects new stock level

**Test on:** Chrome, Firefox

#### Test Case 5.4: Manage User Roles
**Prerequisites:** Admin user
**Steps:**
1. Navigate to Admin > Users
2. Enter valid Principal ID
3. Click "Grant Admin Role"
4. Verify role change
5. Click "Revoke Admin Role"

**Expected Results:**
- Principal validation works
- Role granted successfully
- Role revoked successfully
- Toast confirmations shown

**Test on:** Chrome, Firefox

#### Test Case 5.5: View All Orders
**Prerequisites:** Admin user, existing orders
**Steps:**
1. Navigate to Admin > Orders
2. View order list
3. Use filter to search by order ID or principal

**Expected Results:**
- All orders displayed
- Filter works correctly
- Order details accurate

**Test on:** Chrome, Firefox

### 6. Contact Form Submission

#### Test Case 6.1: Submit Contact Form
**Prerequisites:** None
**Steps:**
1. Navigate to /contact
2. Fill in all form fields (name, email, subject, message)
3. Click "Send Message"

**Expected Results:**
- Form validation works
- Submission shows loading state
- Success toast appears
- Form clears after submission
- Mobile keyboard behavior correct

**Test on:** All browsers and devices

### 7. Offline Mutation Queue

#### Test Case 7.1: Queue Multiple Actions
**Prerequisites:** Logged in, offline mode
**Steps:**
1. Disconnect from network
2. Save multiple artifacts
3. Add products to cart
4. Attempt checkout
5. Reconnect to network

**Expected Results:**
- All actions queued
- Sync status shows queue count
- Actions replay in order
- All operations complete successfully

**Test on:** Chrome, Firefox

#### Test Case 7.2: View Queue Dialog
**Prerequisites:** Queued actions exist
**Steps:**
1. Click "View Queue" in sync status
2. Review queued actions
3. Retry failed action
4. Remove action from queue

**Expected Results:**
- Dialog shows all queued actions
- Action details clear and readable
- Retry works for retryable actions
- Remove works correctly
- Clear Failed works

**Test on:** Chrome, Firefox

#### Test Case 7.3: Handle Failed Actions
**Prerequisites:** Logged in
**Steps:**
1. Queue action that will fail (e.g., invalid data)
2. Wait for sync attempt
3. View failed action in queue
4. Remove failed action

**Expected Results:**
- Failed action marked clearly
- Error message displayed
- Retry available if retryable
- Remove works correctly

**Test on:** Chrome, Firefox

### 8. Navigation & Mobile Menu

#### Test Case 8.1: Desktop Navigation
**Prerequisites:** None
**Steps:**
1. Navigate through all menu items
2. Verify active states
3. Test keyboard navigation (Tab, Enter)

**Expected Results:**
- All links work correctly
- Active page highlighted
- Keyboard navigation smooth
- Focus visible

**Test on:** Chrome, Firefox, Safari, Edge

#### Test Case 8.2: Mobile Menu
**Prerequisites:** Mobile device or narrow viewport
**Steps:**
1. Open mobile menu
2. Navigate to different page
3. Verify menu closes
4. Open menu again
5. Close with X button

**Expected Results:**
- Menu opens/closes smoothly
- Body scroll locked when open
- Menu closes on navigation
- Close button works
- No scroll issues on iOS Safari

**Test on:** iOS Safari, Android Chrome

### 9. Accessibility & Reduced Motion

#### Test Case 9.1: Reduced Motion Preference
**Prerequisites:** System reduced motion enabled
**Steps:**
1. Enable reduced motion in OS settings
2. Navigate through all pages
3. Interact with animations

**Expected Results:**
- No parallax effects
- No fade-in animations
- No flip card animations
- Hover effects minimal or none
- All content still accessible

**Test on:** Chrome, Firefox, Safari

#### Test Case 9.2: Keyboard Navigation
**Prerequisites:** None
**Steps:**
1. Navigate entire site using only keyboard
2. Tab through all interactive elements
3. Use Enter/Space to activate buttons
4. Use Escape to close modals

**Expected Results:**
- All interactive elements reachable
- Focus visible at all times
- Logical tab order
- Modals trap focus correctly
- Escape closes modals

**Test on:** Chrome, Firefox, Safari

#### Test Case 9.3: Screen Reader (Basic)
**Prerequisites:** Screen reader enabled
**Steps:**
1. Navigate homepage with screen reader
2. Navigate shop page
3. Open product modal
4. Navigate dashboard

**Expected Results:**
- Semantic HTML structure clear
- ARIA labels present and accurate
- Headings in logical order
- Form labels associated correctly
- Modal announcements work

**Test on:** Chrome + NVDA, Safari + VoiceOver

### 10. Error Handling & Recovery

#### Test Case 10.1: Network Error Recovery
**Prerequisites:** Logged in
**Steps:**
1. Navigate to shop
2. Simulate network error (disconnect)
3. Attempt to load data
4. Reconnect
5. Click retry

**Expected Results:**
- Error state displayed with message
- Retry button available
- Offline indicator shown
- Data loads after retry
- No blank screens

**Test on:** Chrome, Firefox

#### Test Case 10.2: Error Boundary
**Prerequisites:** None
**Steps:**
1. Trigger runtime error (if possible via dev tools)
2. View error boundary UI
3. Click reload/recovery action

**Expected Results:**
- Error boundary catches error
- Fallback UI displayed
- Recovery action works
- No blank screen
- Error logged locally

**Test on:** Chrome, Firefox

## Cross-Browser Compatibility Checklist

### Layout & Styling
- [ ] Header/navigation renders correctly
- [ ] Footer renders correctly
- [ ] Cards and containers aligned properly
- [ ] Responsive breakpoints work
- [ ] Dark theme consistent
- [ ] Fonts load correctly

### Interactive Elements
- [ ] Buttons clickable and styled correctly
- [ ] Form inputs functional
- [ ] Dropdowns/selects work
- [ ] Modals/dialogs open and close
- [ ] Tooltips appear correctly
- [ ] Toasts/notifications display

### Animations & Effects
- [ ] Hover effects work
- [ ] Transitions smooth
- [ ] Parallax effects (when not reduced motion)
- [ ] Fade-in animations
- [ ] Loading spinners

### Data & State
- [ ] Data loads correctly
- [ ] Mutations work
- [ ] Local storage persists
- [ ] Cache invalidation works
- [ ] Offline queue functions

## Mobile-Specific Tests

### Touch Interactions
- [ ] Tap targets adequate size (min 44x44px)
- [ ] Swipe gestures work (carousels)
- [ ] Pinch zoom disabled where appropriate
- [ ] Long press doesn't interfere

### Mobile Safari Specific
- [ ] Body scroll lock works
- [ ] Modal scrolling works
- [ ] Viewport height correct (100vh issues)
- [ ] Input zoom disabled (font-size >= 16px)
- [ ] Safe area insets respected

### Android Chrome Specific
- [ ] Address bar hide/show doesn't break layout
- [ ] Back button works correctly
- [ ] Form autofill works
- [ ] File inputs work (if applicable)

## Performance Checks

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Route transitions smooth
- [ ] Lazy loading works
- [ ] Images optimized

### Runtime Performance
- [ ] Smooth scrolling (60fps)
- [ ] No layout thrashing
- [ ] Animations smooth
- [ ] No memory leaks (long sessions)

## Post-Deployment Validation

After deploying to production, verify:

1. **Authentication Flow**
   - [ ] Internet Identity login works
   - [ ] Logout clears session
   - [ ] Profile setup for new users

2. **Core Features**
   - [ ] Shop browsing works
   - [ ] Add to cart functions
   - [ ] Checkout creates orders
   - [ ] Admin panel accessible (for admins)

3. **Data Persistence**
   - [ ] Orders saved correctly
   - [ ] Saved artifacts persist
   - [ ] User profiles stored
   - [ ] Local cart survives refresh

4. **Offline Functionality**
   - [ ] Offline detection works
   - [ ] Mutation queue functions
   - [ ] Sync on reconnect
   - [ ] Queue management UI

5. **Error Handling**
   - [ ] Error boundary catches errors
   - [ ] Network errors handled gracefully
   - [ ] User-friendly error messages
   - [ ] Recovery actions work

6. **Analytics (if configured)**
   - [ ] Pageviews tracked
   - [ ] Events logged
   - [ ] No console errors from analytics

## Bug Reporting Template

When reporting bugs found during testing, include:

- **Browser/Device:** [e.g., Chrome 120 on Windows 11]
- **Test Case:** [Reference test case number]
- **Steps to Reproduce:** [Detailed steps]
- **Expected Result:** [What should happen]
- **Actual Result:** [What actually happened]
- **Screenshots/Video:** [If applicable]
- **Console Errors:** [Any errors in browser console]
- **Severity:** [Critical/High/Medium/Low]

## Test Sign-Off

| Test Category | Chrome | Firefox | Safari | Edge | iOS Safari | Android Chrome | Status |
|--------------|--------|---------|--------|------|------------|----------------|--------|
| Authentication | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Role Access | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Shop & Products | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Checkout | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Admin Operations | [ ] | [ ] | [ ] | [ ] | N/A | N/A | |
| Contact Form | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Offline Queue | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Navigation | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Accessibility | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| Error Handling | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |

**Tested By:** _______________  
**Date:** _______________  
**Version:** _______________
