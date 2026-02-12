import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';
import { Skeleton } from './components/ui/skeleton';

const Homepage = lazy(() => import('./pages/Homepage'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Shop = lazy(() => import('./pages/Shop'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const BlogLore = lazy(() => import('./pages/BlogLore'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminAccess = lazy(() => import('./pages/AdminAccess'));
const AdminPlus = lazy(() => import('./pages/AdminPlus'));
const Testimonies = lazy(() => import('./pages/Testimonies'));
const SubmitRequest = lazy(() => import('./pages/SubmitRequest'));
const Inbox = lazy(() => import('./pages/Inbox'));
const SearchArtifacts = lazy(() => import('./pages/SearchArtifacts'));
const Portfolio = lazy(() => import('./pages/Portfolio'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="container mx-auto px-4 py-8 space-y-4">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: Services,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: Shop,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
});

const loreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lore',
  component: BlogLore,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogLore,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQ,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: Terms,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: Privacy,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const adminAccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-access',
  component: AdminAccess,
});

const adminPlusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-plus',
  component: AdminPlus,
});

const testimoniesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonies',
  component: Testimonies,
});

const submitRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-request',
  component: SubmitRequest,
});

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  component: Inbox,
});

const searchArtifactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search-artifacts',
  component: SearchArtifacts,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: Portfolio,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  shopRoute,
  dashboardRoute,
  contactRoute,
  loreRoute,
  blogRoute,
  faqRoute,
  termsRoute,
  privacyRoute,
  adminRoute,
  adminAccessRoute,
  adminPlusRoute,
  testimoniesRoute,
  submitRequestRoute,
  inboxRoute,
  searchArtifactsRoute,
  portfolioRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
