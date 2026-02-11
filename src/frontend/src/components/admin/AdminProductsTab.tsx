import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Plus, Edit, AlertCircle } from 'lucide-react';
import { useGetAllProductsAdmin } from '../../hooks/useQueries';
import ErrorState from '../system/ErrorState';

export default function AdminProductsTab() {
  const { data: products = [], isLoading, error, refetch } = useGetAllProductsAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState title="Failed to load products" onRetry={refetch} />;
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-arcane-gold" />
              Product Management
            </CardTitle>
            <CardDescription>
              {products.length} total {products.length === 1 ? 'product' : 'products'}
              {filteredProducts.length !== products.length && ` (${filteredProducts.length} shown)`}
            </CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="product-search">Search Products</Label>
          <Input
            id="product-search"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {products.length === 0
                ? 'No products have been created yet. Click "Add Product" to get started.'
                : 'No products match your search.'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product: any) => (
              <div
                key={product.id.toString()}
                className="p-4 rounded-lg border border-border/40 bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.isInStock ? 'default' : 'secondary'}>
                      {product.isInStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <Badge variant="outline">
                      {Number(product.price)} ICP
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Stock: {Number(product.stock)} units
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
