/**
 * Centralized route path constants
 * Prevents link/path drift and dead routes
 */

export const ROUTE_PATHS = {
  home: '/',
  about: '/about',
  services: '/services',
  shop: '/shop',
  portfolio: '/portfolio',
  testimonies: '/testimonies',
  lore: '/lore',
  contact: '/contact',
  dashboard: '/dashboard',
  faq: '/faq',
  terms: '/terms',
  privacy: '/privacy',
  admin: '/admin',
  adminAccess: '/admin-access',
  adminPlus: '/admin-plus',
  submitRequest: '/submit-request',
  inbox: '/inbox',
  searchArtifacts: '/search-artifacts',
} as const;

export type RoutePath = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS];
