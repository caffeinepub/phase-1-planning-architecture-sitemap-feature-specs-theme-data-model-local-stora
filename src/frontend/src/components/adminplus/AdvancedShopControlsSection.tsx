import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, DollarSign, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllProductsAdmin, useSetShopActiveState, useGetShopActiveState, useOverrideProductPrice, useClearProductPriceOverride, useSetProductVisibility } from '../../hooks/useQueries';
import type { Product, ProductVisibility } from '../../types/common';

export default function AdvancedShopControlsSection() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProductsAdmin();
  const { data: shopActive = true } = useGetShopActiveState();
  const setShopActive = useSetShopActiveState();
  const overridePriceMutation = useOverrideProductPrice();
  const clearPriceOverride = useClearProductPriceOverride();
  const setVisibility = useSetProductVisibility();

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [newPriceInput, setNewPriceInput] = useState('');

  const handleToggleShop = async () => {
    try {
      await setShopActive.mutateAsync(!shopActive);
      toast.success(shopActive ? 'Shop disabled' : 'Shop enabled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle shop state');
    }
  };

  const handleOverridePrice = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const price = parseFloat(newPriceInput);
    if (isNaN(price) || price < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const productId = BigInt(selectedProductId);
    const priceCents = BigInt(Math.floor(price * 100));

    try {
      await overridePriceMutation.mutateAsync({ productId, price: priceCents });
      toast.success('Price override applied');
      setNewPriceInput('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to override price');
    }
  };

  const handleClearPriceOverride = async () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const productId = BigInt(selectedProductId);

    try {
      await clearPriceOverride.mutateAsync({ productId, price: null });
      toast.success('Price override cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear price override');
    }
  };

  const handleSetVisibility = async (visibility: ProductVisibility) => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }

    const productId = BigInt(selectedProductId);

    try {
      await setVisibility.mutateAsync({ productId, visibility });
      toast.success('Product visibility updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update visibility');
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Shop Disable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Emergency Shop Controls
          </CardTitle>
          <CardDescription>
            Instantly disable the entire shop for maintenance or emergencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Shop Status</p>
              <p className="text-sm text-muted-foreground">
                {shopActive ? 'Shop is currently active' : 'Shop is currently disabled'}
              </p>
            </div>
            <Switch
              checked={shopActive}
              onCheckedChange={handleToggleShop}
              disabled={setShopActive.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Price Override */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-arcane-gold" />
            Product Price Override
          </CardTitle>
          <CardDescription>
            Temporarily override product prices without editing the product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-select">Select Product</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product: Product) => (
                  <SelectItem key={product.id.toString()} value={product.id.toString()}>
                    {product.name} - {Number(product.price) / 100} ICP
                    {product.priceOverride && ' (Override Active)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-price">New Price (ICP)</Label>
            <Input
              id="new-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 10.50"
              value={newPriceInput}
              onChange={(e) => setNewPriceInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleOverridePrice}
              disabled={!selectedProductId || !newPriceInput || overridePriceMutation.isPending}
              className="flex-1"
            >
              Apply Override
            </Button>
            <Button
              onClick={handleClearPriceOverride}
              disabled={!selectedProductId || clearPriceOverride.isPending}
              variant="outline"
              className="flex-1"
            >
              Clear Override
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Visibility Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Product Visibility Control
          </CardTitle>
          <CardDescription>
            Control which products are visible in the shop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selected Product</Label>
            <p className="text-sm text-muted-foreground">
              {selectedProductId 
                ? products.find((p: Product) => p.id.toString() === selectedProductId)?.name || 'Unknown'
                : 'No product selected'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSetVisibility({ __kind__: 'visible' })}
              disabled={!selectedProductId || setVisibility.isPending}
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Visible
            </Button>
            <Button
              onClick={() => handleSetVisibility({ __kind__: 'hidden' })}
              disabled={!selectedProductId || setVisibility.isPending}
              variant="outline"
              className="flex-1"
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Hidden
            </Button>
            <Button
              onClick={() => handleSetVisibility({ __kind__: 'outOfStock' })}
              disabled={!selectedProductId || setVisibility.isPending}
              variant="outline"
              className="flex-1"
            >
              Out of Stock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
