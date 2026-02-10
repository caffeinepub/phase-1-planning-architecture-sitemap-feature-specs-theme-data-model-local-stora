import { useState, useMemo, memo } from 'react';
import { useGetAllProducts, useGetMySavedArtifacts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Grid, List, Search, ShoppingCart } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ProductDetailsModal from '../components/shop/ProductDetailsModal';
import ProductFlipCard from '../components/shop/ProductFlipCard';
import ShopCartDrawer from '../components/shop/ShopCartDrawer';
import { useShopFilters } from '../components/shop/useShopFilters';
import { useLocalCart } from '../hooks/useLocalCart';
import ErrorState from '../components/system/ErrorState';
import type { Product } from '../backend';

export default function Shop() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProducts();
  const { identity } = useInternetIdentity();
  const { data: savedArtifacts = [] } = useGetMySavedArtifacts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems } = useLocalCart();

  const { 
    searchQuery, 
    setSearchQuery, 
    inStockOnly, 
    setInStockOnly, 
    sortBy, 
    setSortBy, 
    filteredProducts 
  } = useShopFilters(products);

  const savedProductIds = useMemo(
    () => new Set(savedArtifacts.map((a) => Number(a.productId))),
    [savedArtifacts]
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedProduct(null), 150);
    }
  };

  const totalCartItems = getTotalItems();

  if (error) {
    return (
      <PageLayout title="Shop" description="Browse our collection of mystical artifacts">
        <ErrorState
          title="Failed to load products"
          description={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={refetch}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Artifact Shop"
      description="Discover rare and powerful artifacts from across the realms"
    >
      <FadeInSection>
        <div className="flex flex-col gap-4 mb-8">
          {/* Top Row: Search and Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search products
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Search artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cart Button */}
            <Button
              variant="default"
              onClick={() => setCartOpen(true)}
              className="gap-2 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {totalCartItems > 0 && (
                <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-5 min-w-5">
                  {totalCartItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* Bottom Row: Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="in-stock"
                  checked={inStockOnly}
                  onCheckedChange={setInStockOnly}
                />
                <Label htmlFor="in-stock" className="cursor-pointer">
                  In stock only
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm">
                  Sort:
                </Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc')}
                  className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                >
                  <option value="name">Name</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2" role="group" aria-label="View mode">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <FadeInSection>
          <Card className="border-border/40">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || inStockOnly ? 'No artifacts match your filters.' : 'No artifacts available.'}
              </p>
            </CardContent>
          </Card>
        </FadeInSection>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product, index) => (
            <FadeInSection key={Number(product.id)} delay={index * 50}>
              {viewMode === 'grid' ? (
                <ProductFlipCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ) : (
                <Card
                  className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-muted-foreground mb-4">{product.shortDescription || product.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-arcane-gold mb-2">
                          {Number(product.price)} ICP
                        </p>
                        <Badge
                          variant={product.isInStock ? 'secondary' : 'destructive'}
                          className={product.isInStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
                        >
                          {product.isInStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </FadeInSection>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={handleModalClose}
        isSaved={selectedProduct ? savedProductIds.has(Number(selectedProduct.id)) : false}
        isAuthenticated={!!identity}
      />

      {/* Shopping Cart Drawer */}
      <ShopCartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </PageLayout>
  );
}
