import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, BookOpen, HelpCircle, Mail, Scroll, Wrench } from 'lucide-react';

const quickLinks = [
  {
    to: '/shop',
    icon: ShoppingBag,
    title: 'Shop',
    description: 'Browse our collection of mystical artifacts',
  },
  {
    to: '/about',
    icon: Scroll,
    title: 'About',
    description: 'Learn about our history and mission',
  },
  {
    to: '/services',
    icon: Wrench,
    title: 'Services',
    description: 'Discover our restoration and appraisal services',
  },
  {
    to: '/blog',
    icon: BookOpen,
    title: 'Lore',
    description: 'Explore stories and legends',
  },
  {
    to: '/faq',
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find answers to common questions',
  },
  {
    to: '/contact',
    icon: Mail,
    title: 'Contact',
    description: 'Get in touch with our team',
  },
];

export default function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.to} to={link.to}>
            <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift h-full">
              <CardHeader>
                <div className="h-10 w-10 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-arcane-gold" />
                </div>
                <CardTitle className="text-lg">{link.title}</CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
