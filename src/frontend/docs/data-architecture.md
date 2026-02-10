# Data Architecture

This document describes the frontend-visible data model and how authentication, roles, and data persistence work in the Arcane Artifacts application.

## Authentication Model

### Internet Identity Integration

The application uses Internet Identity for decentralized authentication. Users authenticate via the Internet Computer's identity system, which provides:

- **Anonymous principals**: Unauthenticated users (guests)
- **Authenticated principals**: Users who have logged in via Internet Identity

### First Admin Bootstrap

On a fresh deployment, the first admin must be established using a secret token mechanism:

1. Append the secret token to the URL: `?caffeineAdminToken=YOUR_SECRET_TOKEN`
2. The token is read from the URL parameter and passed to the backend during actor initialization
3. The backend's access control system uses this token to grant admin privileges to the caller
4. The token is automatically cleared from the URL after initialization for security
5. The token is stored in sessionStorage to persist across page refreshes during the session

**Implementation**: See `frontend/src/hooks/useActor.ts` and `frontend/src/utils/urlParams.ts`

### Role-Based Access Control

The application supports three user roles:

- **Guest**: Anonymous users (not logged in)
- **User**: Authenticated users with basic privileges
- **Admin**: Authenticated users with administrative privileges

#### Role Determination

The frontend determines the current user's role by calling `getCallerUserRole()` on the backend. This query:

- Returns `'guest'` for anonymous principals
- Returns `'user'` for authenticated non-admin users
- Returns `'admin'` for authenticated admin users

**Implementation**: See `frontend/src/hooks/useQueries.ts` - `useGetCallerUserRole()`

#### Role-Based UI Gating

Admin-only pages and features are protected using the `RequireAdmin` component:

