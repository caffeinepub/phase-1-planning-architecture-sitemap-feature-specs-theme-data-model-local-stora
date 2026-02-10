# Phase 7: Iteration & Updates Playbook

This document describes the Phase 7 iteration workflow for collecting user feedback, reviewing it in the admin panel, and implementing page-by-page updates while maintaining offline-first architecture and canister-backed persistence.

## Architecture Overview

### Persistence Model
- **Backend**: Motoko canister on Internet Computer (single-actor architecture)
- **Frontend State**: React Query for server state, localStorage for offline-only state
- **Authentication**: Internet Identity
- **No External Services**: No Supabase, no third-party databases

### Offline-First Strategy
1. **Offline Drafts** (`app_offlineDrafts_v1`): Preserve in-progress form data
2. **Offline Mutation Queue** (`app_offlineMutationQueue_v1`): Queue failed mutations for replay
3. **React Query Invalidation**: Trigger refetches after successful mutations

## In-App Feedback Capture Flow

### User Experience
1. **Access**: Users can open the feedback form from any page via the global header
2. **Form Fields**:
   - Category selector (Bug, Feature Request, UX, Other)
   - Description textarea (required)
   - Optional contact field
3. **Offline Support**:
   - Form data is auto-saved to localStorage as user types
   - If offline/actor unavailable, submission is queued
   - User sees clear English message: "You are offline. Your feedback will be submitted when you reconnect."
4. **Draft Restoration**:
   - Reopening the form restores unsent text
   - Drafts expire after 7 days
5. **Success Confirmation**:
   - Immediate success: Toast notification
   - Queued success: Toast when replay succeeds

### Technical Implementation

#### Components
- `FeedbackDialog.tsx`: Modal form with category, description, contact fields
- `FeedbackLauncher.tsx`: Global button in header to open dialog
- `AppLayout.tsx`: Wires FeedbackLauncher into global layout

#### Hooks
- `useQueuedCreateFeedback()`: Mutation hook that enqueues when actor unavailable
- `useOfflineDrafts('feedback-form')`: Persists/restores form state
- `useOfflineMutationReplay()`: Replays queued feedback on reconnect

#### Offline Mutation Queue
- **Type**: `createFeedback`
- **Params**: `{ userId: string, message: string }`
- **Replay**: Calls `actor.createFeedback(Principal, message)` and invalidates `['feedback']`
- **Success Toast**: "Your feedback has been submitted successfully!"

#### Draft Management
- **Form ID**: `feedback-form`
- **Saved Fields**: `{ category, description, contact }`
- **Auto-save**: On every field change
- **Clear Conditions**:
  - Successful immediate submit
  - Successful queued replay
  - Manual form cancel (draft preserved for next open)

## Admin Review Flow

### Admin Feedback Tab
- **Location**: Admin Panel → Feedback tab
- **Features**:
  - List all feedback submissions
  - Display: category badge, status badge, submitter principal, message text
  - Client-side filtering: text search + category filter
  - Status badges: Open (default), Reviewed (secondary), Completed (outline)
- **Loading/Error States**: Uses `ErrorState` component with English copy

### Backend API
- `getAllFeedback()`: Query returns all feedback entries
- `createFeedback(userId, message)`: Shared update call (authenticated users)
- Authorization: Admin-only for `getAllFeedback()` (enforced by backend)

## Page-by-Page Iteration Checklist

When adding or updating features, follow this checklist for each page:

### 1. Define Feature Requirements
- [ ] Identify user story and acceptance criteria
- [ ] Determine if feature requires new backend API
- [ ] Plan UI/UX flow and component structure

### 2. Backend Updates (if needed)
- [ ] Add new types to `backend/main.mo`
- [ ] Implement canister methods (query/update)
- [ ] Add authorization checks (admin/user/guest)
- [ ] Test backend methods via `dfx canister call`

### 3. Frontend Data Layer
- [ ] Add React Query hooks in `useQueries.ts`
- [ ] Implement queued mutation hooks in `useQueuedMutations.ts` (if offline support needed)
- [ ] Update `offlineMutationQueue.ts` with new mutation type (if offline support needed)
- [ ] Update `useOfflineMutationReplay.ts` replay logic (if offline support needed)

### 4. Offline Drafts (if form-based)
- [ ] Choose unique form ID
- [ ] Use `useOfflineDrafts(formId)` hook
- [ ] Auto-save form state on change
- [ ] Restore draft on mount
- [ ] Clear draft on successful submit and replay

### 5. UI Components
- [ ] Create/update page components
- [ ] Add loading states (inline spinners, skeleton loaders)
- [ ] Add error states (ErrorState component with retry)
- [ ] Add empty states (clear English copy)
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)

### 6. React Query Invalidation
- [ ] Identify which query keys to invalidate after mutations
- [ ] Add `onSuccess` handlers to mutation hooks
- [ ] Test that UI updates after successful mutations

### 7. Testing
- [ ] Test online flow (immediate success)
- [ ] Test offline flow (queued mutations)
- [ ] Test draft restoration (close/reopen form)
- [ ] Test error handling (network errors, authorization errors)
- [ ] Test admin-only features (access control)

### 8. Documentation
- [ ] Update `local-storage-strategy.md` if new localStorage keys added
- [ ] Update `data-architecture.md` if new domain entities added
- [ ] Add inline code comments for complex logic

## Common Patterns

### Queued Mutation Pattern
