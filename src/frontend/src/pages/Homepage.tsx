import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ShoppingBag, BookOpen, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ParallaxLayer from '../components/effects/ParallaxLayer';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import QuickLinksGrid from '../components/home/QuickLinksGrid';
import Announcements from '../components/home/Announcements';

export default function Homepage() {
  return (
    <PageLayout>
      {/* Hero Section with Parallax */}
      <FadeInSection>
        <section className="relative text-center py-16 md:py-24 overflow-hidden">
          <ParallaxLayer speed={0.3} className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-arcane-gold/5 via-transparent to-transparent" />
          </ParallaxLayer>
          
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
              <Button size="lg" className="gap-2 hover-lift">
                <ShoppingBag className="h-5 w-5" />
                Browse Shop
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="gap-2 hover-lift">
                <BookOpen className="h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Carousel */}
      <FadeInSection delay={100}>
        <section className="section-spacing">
          <h2 className="section-title">Featured Artifacts</h2>
          <p className="section-description">
            Discover our most sought-after mystical items, carefully selected for their power and rarity.
          </p>
          <FeaturedCarousel />
        </section>
      </FadeInSection>

      {/* Quick Links */}
      <FadeInSection delay={200}>
        <section className="section-spacing">
          <h2 className="section-title">Explore</h2>
          <p className="section-description">
            Navigate through our realm of mystical offerings and services.
          </p>
          <QuickLinksGrid />
        </section>
      </FadeInSection>

      {/* Features Grid */}
      <FadeInSection delay={300}>
        <section className="section-spacing">
          <h2 className="section-title">Why Choose Arcane Artifacts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift">
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

            <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift">
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

            <Card className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift">
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
      </FadeInSection>

      {/* Announcements */}
      <FadeInSection delay={400}>
        <section className="section-spacing">
          <h2 className="section-title">Latest News</h2>
          <p className="section-description">
            Stay updated with our newest collections and special events.
          </p>
          <Announcements />
        </section>
      </FadeInSection>

      {/* CTA Section */}
      <FadeInSection delay={500}>
        <section className="section-spacing text-center">
          <Card className="border-arcane-gold/30 bg-accent/20 hover-lift">
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
      </FadeInSection>
    </PageLayout>
  );
}
