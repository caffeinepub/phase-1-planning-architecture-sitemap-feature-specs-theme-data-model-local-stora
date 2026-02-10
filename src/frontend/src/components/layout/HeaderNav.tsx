import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerOwner } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

export default function HeaderNav() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isOwner } = useIsCallerOwner();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/testimonies', label: 'Testimonies' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (to: string) => {
    setMobileMenuOpen(false);
    navigate({ to });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display text-2xl font-bold text-primary">
            Arcane Artifacts
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {identity && (
            <>
              <Link
                to="/submit-request"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Submit Request
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin
              </Link>
              {isOwner && (
                <Link
                  to="/admin-plus"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Admin+
                </Link>
              )}
            </>
          )}
          <LoginButton />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <LoginButton />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className="text-left text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </button>
                ))}
                {identity && (
                  <>
                    <button
                      onClick={() => handleNavClick('/submit-request')}
                      className="text-left text-lg font-medium transition-colors hover:text-primary"
                    >
                      Submit Request
                    </button>
                    <button
                      onClick={() => handleNavClick('/dashboard')}
                      className="text-left text-lg font-medium transition-colors hover:text-primary"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('/admin')}
                      className="text-left text-lg font-medium transition-colors hover:text-primary"
                    >
                      Admin
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleNavClick('/admin-plus')}
                        className="text-left text-lg font-medium transition-colors hover:text-primary"
                      >
                        Admin+
                      </button>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
