# Production Deployment Guide - Arcane Artifacts

## Overview
This guide covers deploying the Arcane Artifacts application to production. The application consists of:
- **Frontend:** React/TypeScript SPA
- **Backend:** Motoko canister on the Internet Computer
- **Authentication:** Internet Identity

## Prerequisites

- DFX CLI installed (for IC deployment)
- Node.js 18+ and pnpm
- Access to deployment accounts (IC principal for canister management)
- Optional: Vercel/Netlify account for frontend hosting

## Backend Deployment (Internet Computer)

### Initial Deployment

1. **Build the backend canister:**
   ```bash
   dfx build backend
   ```

2. **Deploy to IC mainnet:**
   ```bash
   dfx deploy backend --network ic
   ```

3. **Note the canister ID:**
   After deployment, save the backend canister ID. You'll need it for frontend configuration.
   ```bash
   dfx canister id backend --network ic
   ```

4. **Initialize first admin (automatic):**
   The first user to log in will automatically be granted admin role. This is handled in `frontend/src/hooks/useActor.ts`.

### Upgrading the Backend

When updating the backend code:

1. **Build the updated canister:**
   ```bash
   dfx build backend
   ```

2. **Upgrade the canister (preserves state):**
   ```bash
   dfx canister install backend --mode upgrade --network ic
   ```

3. **Verify health check:**
   ```bash
   dfx canister call backend healthCheck --network ic
   ```

### Backend Environment Variables

The backend requires no environment variables. All configuration is in the Motoko code.

## Frontend Deployment

### Option 1: Static Host (Vercel/Netlify)

#### Vercel Deployment

1. **Configure environment variables in Vercel dashboard:**
   ```
   VITE_BACKEND_CANISTER_ID=<your-backend-canister-id>
   VITE_DFX_NETWORK=ic
   VITE_ANALYTICS_MODE=none  # or 'first-party' or 'google-analytics'
   VITE_GA_TRACKING_ID=<optional-ga-id>
   ```

2. **Build settings:**
   - Build Command: `cd frontend && pnpm install && pnpm build:skip-bindings`
   - Output Directory: `frontend/dist`
   - Install Command: `pnpm install`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Netlify Deployment

1. **Create `netlify.toml` in project root:**
   ```toml
   [build]
     base = "frontend"
     command = "pnpm install && pnpm build:skip-bindings"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Configure environment variables in Netlify dashboard:**
   Same as Vercel above.

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: IC-Hosted Frontend

Deploy the frontend as an asset canister on the Internet Computer:

1. **Create frontend canister:**
   ```bash
   dfx canister create frontend --network ic
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   pnpm install
   pnpm build
   ```

3. **Deploy frontend canister:**
   ```bash
   dfx deploy frontend --network ic
   ```

4. **Access via IC gateway:**
   ```
   https://<frontend-canister-id>.ic0.app
   ```

### Frontend Environment Variables

Required:
- `VITE_BACKEND_CANISTER_ID`: Backend canister ID from IC deployment
- `VITE_DFX_NETWORK`: Set to `ic` for production

Optional (Analytics):
- `VITE_ANALYTICS_MODE`: `none` (default), `first-party`, or `google-analytics`
- `VITE_GA_TRACKING_ID`: Google Analytics tracking ID (if using GA mode)

Example `.env.production`:
