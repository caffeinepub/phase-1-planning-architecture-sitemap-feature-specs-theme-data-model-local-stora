import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Power, DollarSign, Eye, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllProductsAdmin, useGetShopActiveState, useSetShopActiveState, useOverrideProductPrice, useClearProductPriceOverride, useSetProductVisibility } from '../../hooks/useQueries';
import { ProductVisibility } from '../../backend';
import { toast } from 'sonner';

export default function AdvancedShopControlsSection() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProductsAdmin();
  const { data: shopActive = true, isLoading: shopStateLoading } = useGetShopActiveState();
  const setShopActive = useSetShopActiveState();
  const overridePrice = useOverrideProductPrice();
  const clearPriceOverride = useClearProductPriceOverride();
  const setVisibility = useSetProductVisibility();

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [overrideAmount, setOverrideAmount] = useState<string>('');

  const handleShopToggle = async () => {
    try {
      await setShopActive.mutateAsync(!shopActive);
      toast.success(shopActive ? 'Shop disabled successfully' : 'Shop enabled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update shop state');
    }
  };

  const handleSetPriceOverride = async () => {
    if (!selectedProduct || !overrideAmount) {
      toast.error('Please select a product and enter a price');
      return;
    }

    try {
      const productId = BigInt(selectedProduct);
      const newPrice = BigInt(Math.round(parseFloat(overrideAmount) * 100));
      await overridePrice.mutateAsync({ productId, newPrice });
      toast.success('Price override set successfully');
      setOverrideAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to set price override');
    }
  };

  const handleClearPriceOverride = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    try {
      const productId = BigInt(selectedProduct);
      await clearPriceOverride.mutateAsync(productId);
      toast.success('Price override cleared successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear price override');
    }
  };

  const handleSetVisibility = async (visibility: ProductVisibility) => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    try {
      const productId = BigInt(selectedProduct);
      await setVisibility.mutateAsync({ productId, visibility });
      toast.success('Product visibility updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product visibility');
    }
  };

  const selectedProductData = products.find(p => p.id.toString() === selectedProduct);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            Emergency Shop Disable Switch
          </CardTitle>
          <CardDescription>
            Instantly hide the shop and checkout system from customers during maintenance or issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shopStateLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading shop state...
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">Shop Status</div>
                  <div className="text-sm text-muted-foreground">
                    {shopActive ? 'Shop is currently active and accepting orders' : 'Shop is currently disabled'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={shopActive ? 'default' : 'destructive'}>
                    {shopActive ? 'Active' : 'Disabled'}
                  </Badge>
                  <Switch
                    checked={shopActive}
                    onCheckedChange={handleShopToggle}
                    disabled={setShopActive.isPending}
                  />
                </div>
              </div>

              {!shopActive && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The shop is currently disabled. Customers cannot view products or place orders.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Override Product Pricing
          </CardTitle>
          <CardDescription>
            Temporarily or permanently adjust product prices without editing the main product listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {productsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="product-select">Select Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product-select">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id.toString()} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProductData && (
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-medium">${(Number(selectedProductData.price) / 100).toFixed(2)}</span>
                  </div>
                  {selectedProductData.priceOverride && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Override Price:</span>
                      <span className="font-medium text-primary">
                        ${(Number(selectedProductData.priceOverride) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Effective Price:</span>
                    <span className="font-bold">
                      ${(Number(selectedProductData.priceOverride || selectedProductData.price) / 100).toFixed(2)}
                    </span>
                  </div>
                  {selectedProductData.priceOverride && (
                    <Badge variant="secondary" className="mt-2">Override Active</Badge>
                  )}
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="override-price">Override Price ($)</Label>
                <Input
                  id="override-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter new price..."
                  value={overrideAmount}
                  onChange={(e) => setOverrideAmount(e.target.value)}
                  disabled={!selectedProduct}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSetPriceOverride}
                  disabled={!selectedProduct || !overrideAmount || overridePrice.isPending}
                  className="flex-1"
                >
                  {overridePrice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set Override
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearPriceOverride}
                  disabled={!selectedProduct || !selectedProductData?.priceOverride || clearPriceOverride.isPending}
                  className="flex-1"
                >
                  {clearPriceOverride.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Clear Override
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Force Stock States
          </CardTitle>
          <CardDescription>
            Manually set products to in-stock, out-of-stock, or hidden regardless of automated inventory settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {productsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          ) : (
            <>
              {!selectedProduct && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Select a product above to manage its visibility state
                  </AlertDescription>
                </Alert>
              )}

              {selectedProductData && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Current Visibility:</span>
                      <Badge variant={
                        selectedProductData.visibility === 'visible' ? 'default' :
                        selectedProductData.visibility === 'outOfStock' ? 'secondary' : 'destructive'
                      }>
                        {selectedProductData.visibility === 'visible' ? 'Visible' :
                         selectedProductData.visibility === 'outOfStock' ? 'Out of Stock' : 'Hidden'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedProductData.visibility === 'visible' ? 'default' : 'outline'}
                      onClick={() => handleSetVisibility('visible' as ProductVisibility)}
                      disabled={setVisibility.isPending}
                      className="w-full"
                    >
                      {setVisibility.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Visible
                    </Button>
                    <Button
                      variant={selectedProductData.visibility === 'outOfStock' ? 'default' : 'outline'}
                      onClick={() => handleSetVisibility('outOfStock' as ProductVisibility)}
                      disabled={setVisibility.isPending}
                      className="w-full"
                    >
                      {setVisibility.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Out of Stock
                    </Button>
                    <Button
                      variant={selectedProductData.visibility === 'hidden' ? 'default' : 'outline'}
                      onClick={() => handleSetVisibility('hidden' as ProductVisibility)}
                      disabled={setVisibility.isPending}
                      className="w-full"
                    >
                      {setVisibility.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Hidden
                    </Button>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Hidden products will not appear in the customer shop. Out of stock products are visible but cannot be purchased.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
