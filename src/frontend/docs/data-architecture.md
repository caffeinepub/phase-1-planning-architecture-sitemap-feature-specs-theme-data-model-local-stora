# Data Architecture: Internet Computer Canister Storage

## Overview
This application uses Internet Computer canister storage instead of Supabase. All data is stored in stable memory within the Motoko backend actor, providing decentralized, tamper-proof persistence.

## Entity Definitions

### 1. User
**Purpose**: Administrative user records (distinct from UserProfile)

**Fields**:
- `id`: Nat - Unique identifier
- `name`: Text - User's full name
- `email`: Text - Contact email

**Relationships**:
- None direct (admin-managed entity)

**Access Control**:
- Admin only (create, read, update)

**Storage**: Stable Map<Nat, User>

---

### 2. UserProfile
**Purpose**: User-managed profile information tied to Internet Identity Principal

**Fields**:
- `name`: Text - Display name
- `email`: Text - Contact email

**Key**: Principal (Internet Identity)

**Relationships**:
- One-to-one with Principal
- Referenced by Orders and SavedArtifacts

**Access Control**:
- Users can manage their own profile
- Admins can view any profile

**Storage**: Stable Map<Principal, UserProfile>

---

### 3. Product
**Purpose**: Artifacts/items available in the shop

**Fields**:
- `id`: Nat - Unique identifier
- `name`: Text - Product name
- `description`: Text - Detailed description
- `price`: Nat - Price in smallest currency unit
- `stock`: Nat - Available quantity

**Relationships**:
- Referenced by Orders (many-to-many via productIds array)
- Referenced by SavedArtifacts

**Access Control**:
- Public read (anyone can view)
- Admin only (create, update)

**Storage**: Stable Map<Nat, Product>

**Future Fields** (Phase 2+):
- `category`: Text
- `imageUrl`: Text or Blob
- `rarity`: Enum
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

---

### 4. Order
**Purpose**: Purchase records

**Fields**:
- `id`: Nat - Unique identifier
- `userId`: Principal - Buyer's identity
- `productIds`: [Nat] - Array of purchased product IDs
- `totalAmount`: Nat - Total order value

**Relationships**:
- Belongs to one User (via Principal)
- References multiple Products

**Access Control**:
- Users can view their own orders
- Admins can view all orders

**Storage**: Stable Map<Nat, Order>

**Future Fields** (Phase 2+):
- `status`: Enum (pending, processing, shipped, delivered, cancelled)
- `createdAt`: Timestamp
- `shippingAddress`: Text
- `trackingNumber`: Text

---

### 5. SavedArtifact
**Purpose**: User's saved/favorited products

**Fields**:
- `userId`: Principal - User who saved the artifact
- `productId`: Nat - Saved product ID

**Relationships**:
- Belongs to one User (via Principal)
- References one Product

**Access Control**:
- Users can manage their own saved artifacts
- Admins can view any user's saved artifacts

**Storage**: Stable Map<Principal, [SavedArtifact]>

**Note**: Stored as array per user for efficient retrieval

---

## Data Flow Patterns

### Authentication Flow
1. User authenticates via Internet Identity
2. Frontend receives Principal
3. Backend checks if UserProfile exists
4. If not, prompt user to create profile
5. Store Principal in session

### Product Browsing (Public)
1. Anonymous or authenticated user requests products
2. Backend returns all products (no auth required)
3. Frontend displays with filters/search (client-side)
4. Recently viewed stored in local storage

### Saving Artifacts (Authenticated)
1. User clicks "Save" on product
2. Frontend calls `saveArtifact(productId)`
3. Backend verifies authentication
4. Adds to user's SavedArtifacts array
5. Frontend updates UI optimistically

### Placing Orders (Authenticated)
1. User selects products and proceeds to checkout
2. Frontend calls `createOrder(productIds, totalAmount)`
3. Backend verifies authentication
4. Creates Order record
5. (Future) Updates product stock
6. Returns order ID

### Admin Operations
1. Admin authenticates
2. Backend verifies admin role
3. Admin can create/update products
4. Admin can view all orders and users
5. Admin can update inventory

## Persistence Strategy

### Stable Memory
All data structures use stable memory to survive canister upgrades:
- `stable var users: Map<Nat, User>`
- `stable var products: Map<Nat, Product>`
- `stable var orders: Map<Nat, Order>`
- `stable var savedArtifacts: Map<Principal, [SavedArtifact]>`
- `stable var userProfiles: Map<Principal, UserProfile>`

### ID Generation
- Auto-incrementing counters for Nat IDs
- `nextUserId`, `nextProductId`, `nextOrderId`
- Stored as stable vars

### Indexing
- Primary keys: Nat IDs or Principal
- No secondary indexes in Phase 1
- Future: Add indexes for common queries (e.g., products by category)

## Scalability Considerations

### Current Limitations
- Single canister storage
- In-memory data structures
- No pagination in Phase 1

### Future Optimizations (Phase 2+)
- Implement pagination for large datasets
- Add caching layer
- Consider multi-canister architecture for scale
- Implement search indexes
- Add data archival for old orders

## Data Validation

### Backend Validation
- Required fields checked
- Type safety via Motoko
- Authorization checks on all mutations

### Frontend Validation
- Form validation before submission
- Type safety via TypeScript
- Optimistic UI updates with rollback

## Backup & Recovery

### Canister Upgrades
- All data in stable memory survives upgrades
- Test upgrade process in development

### Data Export (Future)
- Admin function to export data as JSON
- Periodic backups to external storage
- Audit logs for compliance

## Comparison to Supabase Approach

| Feature | Supabase | IC Canister |
|---------|----------|-------------|
| Storage | PostgreSQL | Stable Memory |
| Auth | Supabase Auth | Internet Identity |
| API | REST/GraphQL | Candid Interface |
| Hosting | Centralized | Decentralized |
| Scaling | Vertical/Horizontal | Multi-canister |
| Cost | Usage-based | Cycles-based |
| Ownership | Supabase controls | User controls |

## Security Considerations

### Access Control
- Role-based (guest, user, admin)
- Principal-based identity
- No password storage (delegated to II)

### Data Privacy
- Users can only access their own data
- Admins have elevated permissions
- No PII stored unnecessarily

### Audit Trail (Future)
- Log all mutations
- Track admin actions
- Compliance reporting
