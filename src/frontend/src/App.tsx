import { StrictMode, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import Homepage from './pages/Homepage';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load secondary routes for code splitting
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="page-container">
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
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
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <About />
    </Suspense>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Services />
    </Suspense>
  ),
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Shop />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Dashboard />
    </Suspense>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Contact />
    </Suspense>
  ),
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <BlogLore />
    </Suspense>
  ),
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <FAQ />
    </Suspense>
  ),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Terms />
    </Suspense>
  ),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Privacy />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <Suspense fallback={<PageLoadingFallback />}>
      <Admin />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  shopRoute,
  dashboardRoute,
  contactRoute,
  blogRoute,
  faqRoute,
  termsRoute,
  privacyRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
