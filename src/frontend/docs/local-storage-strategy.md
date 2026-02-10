# Local Storage Strategy

This document outlines the frontend's local storage architecture, distinguishing between local-only caches and persisted canister-backed domain data.

## Storage Categories

### 1. Local-Only Storage (No Canister Backing)
These items are stored only in the browser and are not synced to the backend canister:

- **Recently Viewed Products** (`app_recentlyViewed_v1`)
  - Tracks user browsing history for quick access
  - Expires after 7 days
  - Version: 1

- **Session State** (`app_sessionState_v1`)
  - Temporary UI state (filters, view preferences, etc.)
  - Cleared on logout
  - Version: 1

- **Offline Drafts** (`app_offlineDrafts_v1`)
  - Temporary form data saved while offline
  - Cleared after successful submission
  - Version: 1

- **Local Cart** (`app_localCart_v1`)
  - Shopping cart items stored locally
  - Persists across sessions
  - Not synced to backend until checkout
  - Version: 1

- **Offline Mutation Queue** (`app_offlineMutationQueue_v1`)
  - Queue of failed canister mutations to replay when online
  - Automatically processed when connectivity returns
  - Version: 1

### 2. Canister-Backed Domain Data
These entities are persisted in the backend canister and fetched via React Query:

- **User Profiles** (`UserProfile`)
  - Managed via `getCallerUserProfile()` and `saveCallerUserProfile()`
  - Cached by React Query with key `['currentUserProfile']`

- **Products** (`Product`)
  - Managed via `getAllProducts()`, `getProduct()`, `createProduct()`, etc.
  - Cached by React Query with keys `['products']` and `['product', id]`

- **Orders** (`Order`)
  - Managed via `getMyOrders()`, `getAllOrders()`, `createOrder()`
  - Cached by React Query with keys `['myOrders']` and `['allOrders']`

- **Saved Artifacts** (`SavedArtifact`)
  - Managed via `getMySavedArtifacts()`, `saveArtifact()`, `removeSavedArtifact()`
  - Cached by React Query with key `['mySavedArtifacts']`

- **Guild Orders** (`GuildOrder`)
  - Managed via `getAllGuildOrders()`, `createGuildOrder()`, etc.
  - Cached by React Query with key `['guildOrders']`

- **User Roles** (`UserRole`)
  - Managed via `getCallerUserRole()`, `assignAdminRole()`, `removeAdminRole()`
  - Cached by React Query with key `['currentUserRole']`

## Data Consistency Strategy

### React Query Invalidation
All canister-backed data uses React Query for caching and automatic refetching. When mutations occur, we invalidate relevant query keys to trigger refetches:

- Creating/editing a product → invalidate `['products']`
- Creating an order → invalidate `['myOrders']` and `['allOrders']`
- Saving/removing an artifact → invalidate `['mySavedArtifacts']`
- Updating user role → invalidate `['currentUserRole']`

### Offline Support
The offline mutation queue (`app_offlineMutationQueue_v1`) stores failed mutations when the canister is unavailable. When connectivity returns, these mutations are automatically replayed in order and removed from the queue on success.

Supported offline mutations:
- Save/remove saved artifacts
- Create orders
- Create/edit products (admin)
- Update product stock (admin)
- Assign/remove admin roles (admin)

### Logout Behavior
On logout, we clear:
- React Query cache (all canister-backed data)
- Session storage (`app_sessionState_v1`)
- Offline drafts (`app_offlineDrafts_v1`)

We preserve:
- Recently viewed products (user preference)
- Local cart (shopping convenience)
- Offline mutation queue (to sync when user logs back in)

## No Supabase Integration
This application does **not** use Supabase or any external database. All persistent data is stored in the Motoko backend canister on the Internet Computer. The frontend uses:
- Internet Identity for authentication
- React Query for server state management
- Versioned localStorage for local-only caching

## Storage Versioning
All localStorage items use a versioning system to handle schema changes gracefully:
- Items are stored with a `version` field
- Reading checks version compatibility
- Mismatched versions are automatically cleared
- This prevents stale data from causing errors after updates
