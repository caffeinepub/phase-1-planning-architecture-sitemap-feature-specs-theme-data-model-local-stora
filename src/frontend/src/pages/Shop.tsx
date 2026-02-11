import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetAllProducts, useGetShopActiveState } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Grid, List, Search, ShoppingCart, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ProductDetailsModal from '../components/shop/ProductDetailsModal';
import ProductFlipCard from '../components/shop/ProductFlipCard';
import ShopCartDrawer from '../components/shop/ShopCartDrawer';
import { useShopFilters } from '../components/shop/useShopFilters';
import { useLocalCart } from '../hooks/useLocalCart';
import ErrorState from '../components/system/ErrorState';
import type { Product } from '../types/common';

export default function Shop() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProducts();
  const { data: shopActive = true, isLoading: shopStateLoading } = useGetShopActiveState();
  const { identity } = useInternetIdentity();
  const { items: cart } = useLocalCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartOpen, setCartOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    filteredProducts,
  } = useShopFilters(products as Product[]);

  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  if (shopStateLoading || isLoading) {
    return (
      <PageLayout title="Arcane Artifacts Shop" description="Browse our mystical collection">
        <FadeInSection>
          <section className="section-spacing">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (!shopActive) {
    return (
      <PageLayout title="Shop Temporarily Closed" description="We'll be back soon">
        <FadeInSection>
          <section className="section-spacing">
            <div className="max-w-2xl mx-auto">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-center py-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Shop Under Maintenance</h2>
                    <p className="text-muted-foreground">
                      Our shop is currently closed for maintenance or updates. Please check back soon!
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Arcane Artifacts Shop" description="Browse our mystical collection">
        <FadeInSection>
          <section className="section-spacing">
            <ErrorState
              title="Failed to load products"
              onRetry={refetch}
            />
          </section>
        </FadeInSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Arcane Artifacts Shop" description="Browse our mystical collection of enchanted items">
      <FadeInSection>
        <section className="section-spacing">
          {/* Custom Request CTA */}
          <div className="mb-8">
            <Card className="bg-accent/10 border-arcane-gold/20">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for something custom?
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/submit-request">
                    Submit a Custom Request
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="in-stock-toggle"
                    checked={inStockOnly}
                    onCheckedChange={setInStockOnly}
                  />
                  <Label htmlFor="in-stock-toggle" className="cursor-pointer">
                    In Stock Only
                  </Label>
                </div>

                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="sort-select">Sort by:</Label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border rounded-md px-3 py-2 bg-background"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No products found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <ProductFlipCard
                  key={product.id.toString()}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>
      </FadeInSection>

      <ProductDetailsModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
        isSaved={false}
        isAuthenticated={!!identity}
      />

      <ShopCartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </PageLayout>
  );
}
