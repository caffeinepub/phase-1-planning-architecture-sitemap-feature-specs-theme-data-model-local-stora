import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Grid3x3, List, ShoppingCart, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ShopIntro from '../components/intro/ShopIntro';

export default function Shop() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageLayout
      title="Shop"
      description="Browse our mystical collection"
    >
      {/* Mystical Intro Section */}
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          <ShopIntro />
        </section>
      </FadeInSection>

      {/* Shop Awakening Banner */}
      <FadeInSection delay={100}>
        <section className="px-4 sm:px-6 mb-8">
          <Alert className="border-arcane-gold/50 bg-arcane-gold/5">
            <AlertCircle className="h-5 w-5 text-arcane-gold" />
            <AlertDescription className="text-base">
              <strong className="font-display">The Shop is Awakening...</strong>
              <p className="mt-2">
                Our mystical marketplace is currently being enchanted with new artifacts and treasures. 
                While you wait, feel free to request a custom quote for any artifact or service you desire.
              </p>
              <p className="mt-2">
                Reach out via <strong>Facebook Messenger</strong>, <strong>Instagram</strong>, or <strong>TikTok</strong> to discuss your needs directly with our Keepers.
              </p>
            </AlertDescription>
          </Alert>
        </section>
      </FadeInSection>

      {/* Shop Controls */}
      <FadeInSection delay={150}>
        <section className="px-4 sm:px-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Empty State */}
      <FadeInSection delay={200}>
        <section className="px-4 sm:px-6">
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-display font-bold mb-2">No Products Available Yet</h3>
              <p className="text-muted-foreground mb-6">
                Our shop is being prepared with mystical artifacts. Check back soon!
              </p>
              <Badge variant="outline" className="text-sm">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>
    </PageLayout>
  );
}
