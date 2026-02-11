import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useGetAllProducts, useCreateOrder, useValidateCoupon, useGetStoreConfig } from '../../hooks/useQueries';
import { useLocalCart } from '../../hooks/useLocalCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Product } from '../../types/common';

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopCartDrawer({ open, onOpenChange }: ShopCartDrawerProps) {
  const { data: products = [] } = useGetAllProducts();
  const { data: storeConfig } = useGetStoreConfig();
  const { items: cart, updateQuantity, removeFromCart, clearCart } = useLocalCart();
  const { identity } = useInternetIdentity();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const couponsEnabled = storeConfig?.enableCoupons ?? true;

  const cartItems = cart.map((item) => {
    const product = products.find((p: Product) => p.id.toString() === item.productId.toString());
    return { ...item, product };
  }).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.product.priceOverride ?? item.product.price;
    return sum + Number(price) * Number(item.quantity);
  }, 0);

  const discount = appliedCoupon ? Math.floor(subtotal * appliedCoupon.discount / 100) : 0;
  const total = subtotal - discount;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const result = await validateCoupon.mutateAsync(couponCode.trim());
      if (result.valid) {
        setAppliedCoupon({ code: couponCode.trim(), discount: Number(result.discount) });
        toast.success(`Coupon applied! ${result.discount}% off`);
      } else {
        toast.error(result.message || 'Invalid coupon code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const handleCheckout = async () => {
    if (!identity) {
      toast.error('Please log in to place an order');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const productIds = cartItems.flatMap((item) =>
      Array(Number(item.quantity)).fill(item.product!.id)
    );

    try {
      await createOrder.mutateAsync({
        productIds,
        totalAmount: BigInt(total),
        appliedCouponCode: appliedCoupon?.code,
        discountAmount: appliedCoupon ? BigInt(discount) : undefined,
      });
      toast.success('Order placed successfully!');
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  const handleCouponKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidateCoupon();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.product!;
                const price = product.priceOverride ?? product.price;
                const itemTotal = Number(price) * Number(item.quantity);
                const productIdBigInt = BigInt(item.productId);

                return (
                  <div key={item.productId.toString()} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Number(price) / 100} ICP each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(productIdBigInt, Math.max(1, Number(item.quantity) - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity.toString()}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(productIdBigInt, Number(item.quantity) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(productIdBigInt)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{itemTotal / 100} ICP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            {couponsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="flex-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {appliedCoupon.code} ({appliedCoupon.discount}% off)
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={handleRemoveCoupon}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="coupon-code"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyPress={handleCouponKeyPress}
                    />
                    <Button
                      onClick={handleValidateCoupon}
                      disabled={!couponCode.trim() || validatingCoupon}
                      variant="outline"
                    >
                      {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{subtotal / 100} ICP</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Discount ({appliedCoupon.discount}%)</span>
                  <span>-{discount / 100} ICP</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{total / 100} ICP</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!identity || createOrder.isPending}
              className="w-full"
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout'
              )}
            </Button>

            {!identity && (
              <p className="text-xs text-center text-muted-foreground">
                Please log in to complete your purchase
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
