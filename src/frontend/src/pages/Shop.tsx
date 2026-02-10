import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetAllProducts } from '../hooks/useQueries';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useState } from 'react';

export default function Shop() {
  const { data: products, isLoading } = useGetAllProducts();
  const { items: recentlyViewed, addItem } = useRecentlyViewed();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleProductView = (product: any) => {
    addItem({
      productId: Number(product.id),
      productName: product.name,
      productPrice: Number(product.price),
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Artifact Shop
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection of authentic arcane artifacts
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artifacts..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold mb-4">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentlyViewed.slice(0, 5).map((item) => (
              <Card key={item.productId} className="min-w-[200px] border-border/40">
                <CardHeader>
                  <CardTitle className="text-sm">{item.productName}</CardTitle>
                  <CardDescription className="text-xs">
                    {item.productPrice} cycles
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Loading artifacts...</p>
          </div>
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.id.toString()}
              className="border-border/40 hover:border-arcane-gold/50 transition-all hover:shadow-lg cursor-pointer"
              onClick={() => handleProductView(product)}
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-arcane-gold">
                      {Number(product.price)} cycles
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Number(product.stock)} in stock
                    </p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-border/40">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No artifacts available yet. Check back soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Admins can add products via the Admin panel.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
