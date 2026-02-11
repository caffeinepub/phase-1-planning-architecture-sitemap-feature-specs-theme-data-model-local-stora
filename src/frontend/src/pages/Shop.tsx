import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Grid3x3, List, AlertCircle, Sparkles } from 'lucide-react';
import { useGetAllProducts, useGetShopActiveState } from '../hooks/useQueries';
import { useLocalCart } from '../hooks/useLocalCart';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ProductFlipCard from '../components/shop/ProductFlipCard';
import ShopCartDrawer from '../components/shop/ShopCartDrawer';
import ErrorState from '../components/system/ErrorState';
import { useShopFilters } from '../components/shop/useShopFilters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@tanstack/react-router';

export default function Shop() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProducts();
  const { data: shopActive = true } = useGetShopActiveState();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartOpen, setCartOpen] = useState(false);
  const { items: cart, addToCart } = useLocalCart();

  const {
    searchQuery,
    setSearchQuery,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    filteredProducts,
  } = useShopFilters(products);

  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  const handleProductClick = (productId: bigint) => {
    addToCart(productId);
  };

  if (!shopActive) {
    return (
      <PageLayout title="Shop" description="Browse our mystical collection">
        <FadeInSection>
          <section className="section-spacing px-4 sm:px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The shop is currently closed for maintenance. Please check back later.
              </AlertDescription>
            </Alert>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout title="Shop" description="Browse our mystical collection">
        <FadeInSection>
          <section className="section-spacing px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Shop" description="Browse our mystical collection">
        <FadeInSection>
          <section className="section-spacing px-4 sm:px-6">
            <ErrorState title="Failed to load products" onRetry={refetch} />
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Shop" description="Browse our mystical collection">
      <FadeInSection>
        <section className="section-spacing px-4 sm:px-6">
          {/* Shop Awakening Announcement */}
          <Card className="mb-8 border-arcane-gold/40 bg-gradient-to-br from-accent/30 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-arcane-gold">
                <Sparkles className="h-5 w-5" />
                The Shop is Awakening…
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                Our enchanted marketplace is still gathering its magic, and online purchases are not quite available yet. But worry not—your quests and creations need not wait. You may request a custom quote or personalized quest directly through our website, or send a message through Facebook Messenger, Instagram, or TikTok, where we happily discuss custom items, handcrafted products, and unique freelance creations made just for you.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Until the shop fully opens its doors, these pathways remain open—so step forward, share your vision, and together we will craft something extraordinary while the marketplace prepares to come to life. ✨
              </p>
            </CardContent>
          </Card>

          {/* Shop Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={() => setCartOpen(true)} className="relative">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || inStockOnly ? 'No products match your filters' : 'No products available'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <ProductFlipCard 
                  key={product.id.toString()} 
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          )}

          {/* Custom Request CTA */}
          <Card className="mt-12 border-arcane-gold/30 bg-accent/20">
            <CardHeader>
              <CardTitle>Need Something Custom?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Submit a custom request and we'll create something unique for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link to="/submit-request">Submit Request</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </FadeInSection>

      <ShopCartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </PageLayout>
  );
}
