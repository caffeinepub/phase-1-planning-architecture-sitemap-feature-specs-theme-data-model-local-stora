import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X, Scroll } from 'lucide-react';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useQueries';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();
  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/blog', label: 'Lore' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  const authenticatedLinks = [
    { to: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { to: '/admin', label: 'Admin', requiresAdmin: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/arcane-sigil.dim_512x512.png" 
              alt="Arcane Sigil" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex items-center gap-2">
              <Scroll className="h-6 w-6 text-arcane-gold" />
              <span className="text-xl font-display font-bold text-foreground">
                Arcane Artifacts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                activeProps={{
                  className: 'text-arcane-gold bg-accent/50',
                }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                activeProps={{
                  className: 'text-arcane-gold bg-accent/50',
                }}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                activeProps={{
                  className: 'text-arcane-gold bg-accent/50',
                }}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Login Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <LoginButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                  activeProps={{
                    className: 'text-arcane-gold bg-accent/50',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                  activeProps={{
                    className: 'text-arcane-gold bg-accent/50',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-arcane-gold hover:bg-accent/50 rounded-md transition-all"
                  activeProps={{
                    className: 'text-arcane-gold bg-accent/50',
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
