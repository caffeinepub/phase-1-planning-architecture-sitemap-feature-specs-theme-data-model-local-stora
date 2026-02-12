import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAdminEntryLockoutStatus } from '../../hooks/useQueries';
import { isAdminEntryLockedOut } from '../../lib/adminEntryLockout';
import { ROUTE_PATHS } from '../../lib/routePaths';

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useLocalCart();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: backendLockedOut } = useGetAdminEntryLockoutStatus();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Check lockout status - only hide admin link if locked out
  const principalString = identity?.getPrincipal().toString() || '';
  const localLockedOut = principalString ? isAdminEntryLockedOut(principalString) : false;
  const isLockedOut = localLockedOut || backendLockedOut;

  const navLinks = [
    { to: ROUTE_PATHS.home, label: 'Home' },
    { to: ROUTE_PATHS.about, label: 'About' },
    { to: ROUTE_PATHS.services, label: 'Services' },
    { to: ROUTE_PATHS.shop, label: 'Shop' },
    { to: ROUTE_PATHS.portfolio, label: 'Portfolio' },
    { to: ROUTE_PATHS.testimonies, label: 'Testimonies' },
    { to: ROUTE_PATHS.lore, label: 'Lore and Knowledge' },
    { to: ROUTE_PATHS.contact, label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate({ to: ROUTE_PATHS.dashboard });
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate({ to: ROUTE_PATHS.adminAccess });
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={ROUTE_PATHS.home} className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60" />
            <span className="font-bold text-lg hidden sm:inline-block">Arcane Artifacts</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.label}
              </Link>
            ))}
            {!isLockedOut && (
              <Link
                to={ROUTE_PATHS.adminAccess}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: 'text-foreground' }}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: ROUTE_PATHS.shop })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Dashboard Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDashboardClick}
              title="My Dashboard"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-foreground bg-accent' }}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ))}
            {!isLockedOut && (
              <button
                onClick={handleAdminClick}
                className="w-full text-left block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
