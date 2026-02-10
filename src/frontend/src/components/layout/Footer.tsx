import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'arcane-artifacts';

  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-3 text-arcane-gold">
              Arcane Artifacts
            </h3>
            <p className="text-sm text-muted-foreground">
              Discover mystical artifacts and ancient relics from forgotten realms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Lore
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-arcane-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-border/40" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Arcane Artifacts. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-arcane-gold hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
