import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, User, Shield, Inbox, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole, useGetAdminEntryLockoutStatus } from '../../hooks/useQueries';
import { isAdminEntryLockedOut, setAdminEntryLockedOut } from '../../lib/adminEntryLockout';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const { data: backendLockedOut, isFetched: lockoutFetched } = useGetAdminEntryLockoutStatus();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  // Determine if Admin link should be shown
  // Use localStorage-first for instant hiding, then reconcile with backend
  const principalString = identity?.getPrincipal().toString() || '';
  const localLockedOut = isAuthenticated ? isAdminEntryLockedOut(principalString) : false;
  
  // If backend confirms lockout, persist it locally
  useEffect(() => {
    if (isAuthenticated && lockoutFetched && backendLockedOut && principalString) {
      setAdminEntryLockedOut(principalString);
    }
  }, [isAuthenticated, lockoutFetched, backendLockedOut, principalString]);

  // Show Admin link only if not locked out (local or backend)
  const showAdminLink = !localLockedOut && !(lockoutFetched && backendLockedOut);

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/testimonies', label: 'Testimonies' },
    { to: '/submit-request', label: 'Submit Request' },
    { to: '/blog', label: 'Blog & Lore' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('body-scroll-lock');
    } else {
      document.body.classList.remove('body-scroll-lock');
    }
    return () => {
      document.body.classList.remove('body-scroll-lock');
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <img src="/assets/generated/arcane-sigil.dim_512x512.png" alt="Arcane Artifacts" className="h-10 w-10" />
          <span className="font-cinzel text-xl font-bold hidden sm:inline">Arcane Artifacts</span>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
          {showAdminLink && (
            <Link
              to="/admin-access"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors whitespace-nowrap"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Desktop & Tablet Actions */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/search-artifacts' })}
            aria-label="Search Artifacts"
          >
            <Search className="h-5 w-5" />
          </Button>
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/inbox' })}
                aria-label="Inbox"
              >
                <Inbox className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/dashboard' })}
                aria-label="Dashboard"
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          )}
          <LoginButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 touch-manipulation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-3 text-sm font-medium rounded-md hover:bg-accent transition-colors touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/search-artifacts"
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent transition-colors touch-manipulation"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-5 w-5" />
              Search Artifacts
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/inbox"
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent transition-colors touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Inbox className="h-5 w-5" />
                  Inbox
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent transition-colors touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>
              </>
            )}
            
            {showAdminLink && (
              <Link
                to="/admin-access"
                className="flex items-center gap-2 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent transition-colors touch-manipulation"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-5 w-5" />
                Admin
              </Link>
            )}
            
            <div className="pt-2">
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
