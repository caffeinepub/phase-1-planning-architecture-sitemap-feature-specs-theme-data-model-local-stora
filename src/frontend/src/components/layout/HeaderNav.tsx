import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { useIsCallerOwner } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isOwner } = useIsCallerOwner();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
    { to: '/blog', label: 'Blog' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold hover:text-arcane-gold transition-colors">
          <img src="/assets/generated/arcane-sigil.dim_512x512.png" alt="" className="h-8 w-8" />
          <span className="hidden sm:inline">Arcane Artifacts</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-arcane-gold transition-colors"
              activeProps={{ className: 'text-arcane-gold' }}
            >
              {link.label}
            </Link>
          ))}
          {identity && (
            <Link
              to="/dashboard"
              className="text-sm font-medium hover:text-arcane-gold transition-colors"
              activeProps={{ className: 'text-arcane-gold' }}
            >
              Dashboard
            </Link>
          )}
          {identity && (
            <Link
              to="/admin"
              className="text-sm font-medium hover:text-arcane-gold transition-colors"
              activeProps={{ className: 'text-arcane-gold' }}
            >
              Admin
            </Link>
          )}
          {isOwner && (
            <Link
              to="/admin-plus"
              className="text-sm font-medium hover:text-arcane-gold transition-colors flex items-center gap-1"
              activeProps={{ className: 'text-arcane-gold' }}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin+
            </Link>
          )}
        </div>

        {/* Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          <LoginButton />
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium hover:text-arcane-gold hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-arcane-gold bg-accent' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {identity && (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium hover:text-arcane-gold hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-arcane-gold bg-accent' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {identity && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium hover:text-arcane-gold hover:bg-accent rounded-md transition-colors"
                activeProps={{ className: 'text-arcane-gold bg-accent' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {isOwner && (
              <Link
                to="/admin-plus"
                className="px-4 py-2 text-sm font-medium hover:text-arcane-gold hover:bg-accent rounded-md transition-colors flex items-center gap-1"
                activeProps={{ className: 'text-arcane-gold bg-accent' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin+
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
