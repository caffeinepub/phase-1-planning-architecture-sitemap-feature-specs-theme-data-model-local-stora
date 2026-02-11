import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, DollarSign, Eye, EyeOff, Package } from 'lucide-react';
import { useGetAllProductsAdmin, useSetShopActiveState, useGetShopActiveState, useOverrideProductPrice, useClearProductPriceOverride, useSetProductVisibility } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { ProductVisibility } from '../../types/common';

export default function AdvancedShopControlsSection() {
  const { data: shopActive = true, isLoading: shopStateLoading } = useGetShopActiveState();
  const { data: products = [], isLoading: productsLoading } = useGetAllProductsAdmin();
  const setShopActive = useSetShopActiveState();
  const overridePriceMutation = useOverrideProductPrice();
  const clearPriceOverride = useClearProductPriceOverride();
  const setVisibility = useSetProductVisibility();

  const [priceOverrides, setPriceOverrides] = useState<Record<string, string>>({});

  const handleShopToggle = async (active: boolean) => {
    try {
      await setShopActive.mutateAsync(active);
      toast.success(active ? 'Shop enabled' : 'Shop disabled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update shop status');
    }
  };

  const handlePriceOverride = async (productId: bigint) => {
    const priceStr = priceOverrides[productId.toString()];
    if (!priceStr || !priceStr.trim()) {
      toast.error('Please enter a price');
      return;
    }

    const priceFloat = parseFloat(priceStr);
    if (isNaN(priceFloat) || priceFloat < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const priceCents = BigInt(Math.round(priceFloat * 100));

    try {
      await overridePriceMutation.mutateAsync({ productId, newPrice: priceCents });
      toast.success('Price override applied');
      setPriceOverrides(prev => {
        const updated = { ...prev };
        delete updated[productId.toString()];
        return updated;
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to override price');
    }
  };

  const handleClearPriceOverride = async (productId: bigint) => {
    try {
      await clearPriceOverride.mutateAsync(productId);
      toast.success('Price override cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear price override');
    }
  };

  const handleVisibilityChange = async (productId: bigint, visibility: ProductVisibility) => {
    try {
      await setVisibility.mutateAsync({ productId, visibility });
      toast.success('Product visibility updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    }
  };

  const getVisibilityBadge = (visibility: ProductVisibility) => {
    if (visibility.__kind__ === 'visible') return <Badge variant="default">Visible</Badge>;
    if (visibility.__kind__ === 'hidden') return <Badge variant="secondary">Hidden</Badge>;
    if (visibility.__kind__ === 'outOfStock') return <Badge variant="destructive">Out of Stock</Badge>;
    return <Badge>Unknown</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Advanced Shop Controls
        </CardTitle>
        <CardDescription>
          Emergency shop disable, price overrides, and forced stock states
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emergency Shop Disable */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Emergency Shop Disable</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily close the shop for all customers
              </p>
            </div>
            <Switch
              checked={shopActive}
              onCheckedChange={handleShopToggle}
              disabled={shopStateLoading || setShopActive.isPending}
            />
          </div>
          {!shopActive && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">
                Shop is currently disabled. Customers will see a maintenance message.
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Price Overrides */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Price Overrides</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Override product prices without changing base prices
            </p>
          </div>

          {productsLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products available</p>
          ) : (
            <div className="space-y-3">
              {products.map((product: any) => {
                const basePrice = Number(product.price) / 100;
                const productOverridePrice = product.priceOverride ? Number(product.priceOverride) / 100 : null;
                const effectivePrice = productOverridePrice || basePrice;

                return (
                  <div key={product.id.toString()} className="p-3 border rounded-md space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>Base: ${basePrice.toFixed(2)}</span>
                          {productOverridePrice && (
                            <>
                              <span>→</span>
                              <span className="text-primary font-medium">
                                Override: ${productOverridePrice.toFixed(2)}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span className="font-semibold">Effective: ${effectivePrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="New price"
                        value={priceOverrides[product.id.toString()] || ''}
                        onChange={(e) => setPriceOverrides(prev => ({
                          ...prev,
                          [product.id.toString()]: e.target.value
                        }))}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handlePriceOverride(product.id)}
                        disabled={overridePriceMutation.isPending}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Override
                      </Button>
                      {productOverridePrice && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleClearPriceOverride(product.id)}
                          disabled={clearPriceOverride.isPending}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Forced Stock States */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Forced Stock States</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Override product visibility regardless of actual stock
            </p>
          </div>

          {productsLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products available</p>
          ) : (
            <div className="space-y-3">
              {products.map((product: any) => (
                <div key={product.id.toString()} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock.toString()} • {getVisibilityBadge(product.visibility)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityChange(product.id, { __kind__: 'visible' })}
                      disabled={setVisibility.isPending}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visible
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityChange(product.id, { __kind__: 'outOfStock' })}
                      disabled={setVisibility.isPending}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Out of Stock
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityChange(product.id, { __kind__: 'hidden' })}
                      disabled={setVisibility.isPending}
                    >
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hidden
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
