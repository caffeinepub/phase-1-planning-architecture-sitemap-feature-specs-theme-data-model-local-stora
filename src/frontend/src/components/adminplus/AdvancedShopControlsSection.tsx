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
            <Label>Set Price Override</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="product-select" className="text-xs">Select Product</Label>
                <select
                  id="product-select"
                  className="w-full p-2 border rounded-md"
                  value={selectedProductId?.toString() || ''}
                  onChange={(e) => setSelectedProductId(e.target.value ? BigInt(e.target.value) : null)}
                >
                  <option value="">Choose a product...</option>
                  {products.map((product: any) => (
                    <option key={product.id.toString()} value={product.id.toString()}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="override-price" className="text-xs">Override Price ($)</Label>
                <Input
                  id="override-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleSetPriceOverride}
              disabled={!selectedProductId || !overridePrice || overridePriceMutation.isPending}
              className="w-full"
            >
              {overridePriceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Set Price Override
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Active Price Overrides</Label>
            {products.filter((p: any) => p.priceOverride !== null && p.priceOverride !== undefined).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active price overrides
              </p>
            ) : (
              <div className="space-y-2">
                {products
                  .filter((p: any) => p.priceOverride !== null && p.priceOverride !== undefined)
                  .map((product: any) => (
                    <div
                      key={product.id.toString()}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Original: ${(Number(product.price) / 100).toFixed(2)} →{' '}
                          Override: ${(Number(product.priceOverride) / 100).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClearPriceOverride(product.id)}
                        disabled={overridePriceMutation.isPending}
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
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Product Visibility</CardTitle>
          </div>
          <CardDescription>
            Control which products are visible to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No products available
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((product: any) => {
                const visibilityKind = product.visibility?.__kind__ || 'visible';
                const isVisible = visibilityKind === 'visible';
                
                return (
                  <div
                    key={product.id.toString()}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isVisible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <Badge variant={isVisible ? 'default' : 'secondary'} className="text-xs">
                          {visibilityKind}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={isVisible}
                      onCheckedChange={() => handleToggleVisibility(product.id, product.visibility)}
                      disabled={setVisibilityMutation.isPending}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
