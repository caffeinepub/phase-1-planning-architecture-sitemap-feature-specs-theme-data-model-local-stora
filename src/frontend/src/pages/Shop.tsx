import { useState, useMemo, memo } from 'react';
import { useGetAllProducts, useGetMySavedArtifacts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid, List, Search, Eye } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import FadeInSection from '../components/effects/FadeInSection';
import ProductDetailsModal from '../components/shop/ProductDetailsModal';
import { useShopFilters } from '../components/shop/useShopFilters';
import ErrorState from '../components/system/ErrorState';
import type { Product } from '../backend';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ 
  product, 
  viewMode, 
  isSaved, 
  onClick 
}: { 
  product: Product; 
  viewMode: 'grid' | 'list'; 
  isSaved: boolean; 
  onClick: () => void;
}) => {
  const inStock = Number(product.stock) > 0;

  if (viewMode === 'list') {
    return (
      <Card
        className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift cursor-pointer"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription className="mt-2">{product.description}</CardDescription>
            </div>
            <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
              <p className="text-2xl font-bold text-arcane-gold mb-2">
                {Number(product.price)} ICP
              </p>
              <Badge
                variant={inStock ? 'secondary' : 'destructive'}
                className={inStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
              >
                {inStock ? `${product.stock.toString()} in stock` : 'Out of Stock'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-border/40 hover:border-arcane-gold/50 transition-all hover-lift cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-arcane-gold">
            {Number(product.price)} ICP
          </p>
          <Badge
            variant={inStock ? 'secondary' : 'destructive'}
            className={inStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
          >
            {inStock ? `${product.stock.toString()} in stock` : 'Out of Stock'}
          </Badge>
        </div>
        <Button variant="outline" className="w-full gap-2">
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default function Shop() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProducts();
  const { identity } = useInternetIdentity();
  const { data: savedArtifacts = [] } = useGetMySavedArtifacts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { searchQuery, setSearchQuery, filteredProducts } = useShopFilters(products);

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
      // Small delay to prevent visual glitch
      setTimeout(() => setSelectedProduct(null), 150);
    }
  };

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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                {searchQuery ? 'No artifacts match your search.' : 'No artifacts available.'}
              </p>
            </CardContent>
          </Card>
        </FadeInSection>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product, index) => (
            <FadeInSection key={Number(product.id)} delay={index * 50}>
              <ProductCard
                product={product}
                viewMode={viewMode}
                isSaved={savedProductIds.has(Number(product.id))}
                onClick={() => handleProductClick(product)}
              />
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
    </PageLayout>
  );
}
