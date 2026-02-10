import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import BlogLore from './pages/BlogLore';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Create root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Define all routes
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

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
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

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  shopRoute,
  dashboardRoute,
  contactRoute,
  blogRoute,
  faqRoute,
  adminRoute,
  termsRoute,
  privacyRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
