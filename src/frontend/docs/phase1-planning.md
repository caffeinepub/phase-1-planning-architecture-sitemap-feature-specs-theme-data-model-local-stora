# Phase 1: Planning & Architecture

## Project Overview
A dark fantasy themed web application featuring an art/artifact shop with inventory management, user profiles, and content pages. Built on the Internet Computer with Internet Identity authentication.

## Site Map & Page List

### Public Pages (No Authentication Required)
1. **Homepage** (`/`)
   - Hero section with featured artifacts
   - Quick navigation to key sections
   - Recent additions showcase
   - Call-to-action for shop and services

2. **About** (`/about`)
   - Project/business background
   - Mission and vision
   - Team information (if applicable)

3. **Services** (`/services`)
   - Description of offered services
   - Service categories and details
   - Pricing information (if applicable)

4. **Shop** (`/shop`)
   - Product listing with grid/list view
   - Filter and search functionality
   - Product categories
   - Recently viewed items (local storage)
   - Individual product detail view

5. **Blog/Lore** (`/blog`)
   - Lore entries and stories
   - Blog posts about products/artifacts
   - Categorized content
   - Archive/timeline view

6. **FAQ** (`/faq`)
   - Frequently asked questions
   - Accordion-style Q&A sections
   - Search functionality for questions

7. **Contact** (`/contact`)
   - Contact form
   - Business information
   - Social media links

8. **Legal Pages**
   - **Terms of Service** (`/terms`)
   - **Privacy Policy** (`/privacy`)

### Authenticated Pages (Login Required)
9. **Dashboard** (`/dashboard`)
   - User profile overview
   - Order history
   - Saved artifacts collection
   - Account settings

### Admin Pages (Admin Role Required)
10. **Admin Panel** (`/admin`)
    - User management
    - Product/inventory management
    - Order management
    - Content moderation tools

## Navigation Structure

### Primary Navigation (Header)
- Homepage
- About
- Services
- Shop
- Blog/Lore
- FAQ
- Contact
- Dashboard (authenticated users only)
- Admin (admin users only)
- Login/Logout button

### Footer Navigation
- About
- Services
- Contact
- Terms of Service
- Privacy Policy
- Social media links
- Attribution (Built with love using caffeine.ai)

## Access Levels

### Guest (Anonymous)
- Can view: Homepage, About, Services, Shop (browse only), Blog/Lore, FAQ, Contact, Legal pages
- Cannot: Save artifacts, place orders, access dashboard

### Authenticated User
- All guest permissions plus:
- Save artifacts to collection
- Place orders
- Access personal dashboard
- View order history
- Manage profile

### Admin
- All user permissions plus:
- Access admin panel
- Manage products and inventory
- View all orders
- Manage users
- Moderate content

## Key Features by Access Level

### Phase 1 Scope
- Complete page structure and routing
- Design system implementation
- Authentication flow
- Basic data models
- Local storage strategy

### Future Phases
- Full e-commerce functionality
- Real-time inventory updates
- Advanced filtering and search
- User reviews and ratings
- Payment processing
