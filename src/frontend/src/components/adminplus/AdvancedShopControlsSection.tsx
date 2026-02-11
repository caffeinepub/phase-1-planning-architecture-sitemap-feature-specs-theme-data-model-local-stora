import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, DollarSign, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useGetAllProducts, useOverrideProductPrice, useSetProductVisibility, useGetStoreConfig, useSetStoreActive } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { ProductVisibility } from '../../types/common';

export default function AdvancedShopControlsSection() {
  const { data: products = [], refetch: refetchProducts } = useGetAllProducts();
  const { data: storeConfig } = useGetStoreConfig();
  const setStoreActive = useSetStoreActive();
  const overridePriceMutation = useOverrideProductPrice();
  const setVisibilityMutation = useSetProductVisibility();

  const [selectedProductId, setSelectedProductId] = useState<bigint | null>(null);
  const [overridePrice, setOverridePrice] = useState('');

  const isShopActive = storeConfig?.isActive ?? true;

  const handleToggleShop = async () => {
    try {
      await setStoreActive.mutateAsync(!isShopActive);
      toast.success(isShopActive ? 'Shop deactivated' : 'Shop activated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle shop state');
    }
  };

  const handleSetPriceOverride = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const price = parseFloat(overridePrice);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceCents = BigInt(Math.floor(price * 100));

    try {
      await overridePriceMutation.mutateAsync({ productId: selectedProductId, newPrice: priceCents });
      toast.success('Price override set successfully');
      setOverridePrice('');
      setSelectedProductId(null);
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to set price override');
    }
  };

  const handleClearPriceOverride = async (productId: bigint) => {
    try {
      await overridePriceMutation.mutateAsync({ productId, newPrice: null });
      toast.success('Price override cleared');
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear price override');
    }
  };

  const handleToggleVisibility = async (productId: bigint, currentVisibility: ProductVisibility) => {
    const currentKind = currentVisibility.__kind__;
    const newVisibility: ProductVisibility = 
      currentKind === 'visible' ? { __kind__: 'hidden' } : { __kind__: 'visible' };

    try {
      await setVisibilityMutation.mutateAsync({ 
        productId, 
        visibility: newVisibility
      });
      toast.success(`Product ${newVisibility.__kind__ === 'visible' ? 'shown' : 'hidden'}`);
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle visibility');
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Shop Disable */}
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Emergency Shop Control</CardTitle>
          </div>
          <CardDescription>
            Instantly disable the entire shop for maintenance or emergencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={isShopActive ? 'default' : 'destructive'}>
            <AlertDescription>
              Shop is currently <strong>{isShopActive ? 'ACTIVE' : 'DISABLED'}</strong>
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Shop Status</p>
              <p className="text-sm text-muted-foreground">
                {isShopActive ? 'Customers can browse and purchase' : 'Shop is closed to customers'}
              </p>
            </div>
            <Switch
              checked={isShopActive}
              onCheckedChange={handleToggleShop}
              disabled={setStoreActive.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Price Override Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-arcane-gold" />
            <CardTitle>Product Price Overrides</CardTitle>
          </div>
          <CardDescription>
            Set temporary price overrides for specific products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="product-select">Select Product</Label>
              <select
                id="product-select"
                value={selectedProductId?.toString() || ''}
                onChange={(e) => setSelectedProductId(e.target.value ? BigInt(e.target.value) : null)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Choose a product...</option>
                {products.map((product: any) => (
                  <option key={product.id.toString()} value={product.id.toString()}>
                    {product.name} (Original: {Number(product.price) / 100} ICP)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="override-price">Override Price (ICP)</Label>
              <Input
                id="override-price"
                type="number"
                step="0.01"
                value={overridePrice}
                onChange={(e) => setOverridePrice(e.target.value)}
                placeholder="Enter new price..."
              />
            </div>

            <Button
              onClick={handleSetPriceOverride}
              disabled={!selectedProductId || !overridePrice || overridePriceMutation.isPending}
              className="w-full"
            >
              {overridePriceMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              Set Price Override
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Active Overrides</h4>
            {products.filter((p: any) => p.priceOverride !== null).length === 0 ? (
              <p className="text-sm text-muted-foreground">No active price overrides</p>
            ) : (
              <div className="space-y-2">
                {products
                  .filter((p: any) => p.priceOverride !== null)
                  .map((product: any) => (
                    <div key={product.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Original: {Number(product.price) / 100} ICP → Override: {Number(product.priceOverride) / 100} ICP
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClearPriceOverride(product.id)}
                      >
                        Clear
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Product Visibility Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-arcane-gold" />
            <CardTitle>Product Visibility</CardTitle>
          </div>
          <CardDescription>
            Show or hide products from the shop without deleting them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground">No products available</p>
            ) : (
              products.map((product: any) => {
                const visibility: ProductVisibility = product.visibility || { __kind__: 'visible' };
                const isVisible = visibility.__kind__ === 'visible';

                return (
                  <div key={product.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {isVisible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <Badge variant={isVisible ? 'default' : 'secondary'} className="text-xs">
                          {visibility.__kind__}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleVisibility(product.id, visibility)}
                      disabled={setVisibilityMutation.isPending}
                    >
                      {isVisible ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
