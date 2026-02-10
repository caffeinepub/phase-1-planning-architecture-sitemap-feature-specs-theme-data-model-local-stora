import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ShoppingBag, BookOpen, Shield } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Discover Ancient{' '}
          <span className="text-arcane-gold">Arcane Artifacts</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore a curated collection of mystical relics and enchanted items from forgotten realms. 
          Each artifact holds a story waiting to be unveiled.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/shop">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Browse Shop
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="gap-2">
              <BookOpen className="h-5 w-5" />
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Why Choose Arcane Artifacts?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-arcane-gold" />
              </div>
              <CardTitle>Authentic Relics</CardTitle>
              <CardDescription>
                Every artifact is carefully sourced and verified for authenticity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-arcane-gold" />
              </div>
              <CardTitle>Secure Transactions</CardTitle>
              <CardDescription>
                Built on the Internet Computer for decentralized security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-arcane-gold/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-arcane-gold" />
              </div>
              <CardTitle>Rich Lore</CardTitle>
              <CardDescription>
                Discover the stories and legends behind each mystical item
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border/40 overflow-hidden">
            <CardHeader>
              <CardTitle>Ancient Grimoires</CardTitle>
              <CardDescription>
                Tomes of forgotten knowledge and arcane wisdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Explore Collection
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/40 overflow-hidden">
            <CardHeader>
              <CardTitle>Enchanted Artifacts</CardTitle>
              <CardDescription>
                Mystical objects imbued with powerful enchantments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/shop">
                <Button variant="outline" className="w-full">
                  Explore Collection
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <Card className="border-arcane-gold/30 bg-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">
              Begin Your Journey
            </CardTitle>
            <CardDescription className="text-base">
              Join our community of collectors and enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/shop">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Exploring
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
