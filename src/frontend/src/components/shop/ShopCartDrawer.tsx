import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Minus, Plus, Trash2, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useGetAllProducts, useCreateOrder, useValidateCoupon, useGetCouponsActiveState, useGetShopActiveState } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopCartDrawer({ open, onOpenChange }: ShopCartDrawerProps) {
  const { items: cart, updateQuantity, removeFromCart, clearCart } = useLocalCart();
  const { data: products = [] } = useGetAllProducts();
  const { data: couponsEnabled = true } = useGetCouponsActiveState();
  const { data: shopActive = true } = useGetShopActiveState();
  const { identity, login } = useInternetIdentity();
  const createOrder = useCreateOrder();
  const validateCouponMutation = useValidateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: bigint } | null>(null);

  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id.toString() === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const effectivePrice = item.product.priceOverride || item.product.price;
      return sum + Number(effectivePrice) * Number(item.quantity);
    }, 0);
  }, [cartItems]);

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!couponsEnabled) {
      toast.error('Coupons are currently disabled');
      return;
    }

    try {
      const result = await validateCouponMutation.mutateAsync(couponCode.trim());
      if (result.valid) {
        setAppliedCoupon({ code: couponCode.trim(), discount: result.discount });
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate coupon');
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async () => {
    if (!identity) {
      toast.error('Please login to complete your order');
      login();
      return;
    }

    if (!shopActive) {
      toast.error('Shop is currently closed. Orders cannot be placed at this time.');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const productIds = cartItems.map((item) => BigInt(item.productId));
      const couponCodeToSend = appliedCoupon ? appliedCoupon.code : null;

      await createOrder.mutateAsync({
        productIds,
        couponCode: couponCodeToSend,
      });

      toast.success('Order placed successfully!');
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {cartItems.length === 0
              ? 'Your cart is empty'
              : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {!shopActive && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The shop is currently closed. You cannot place orders at this time.
              </AlertDescription>
            </Alert>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const effectivePrice = item.product.priceOverride || item.product.price;
                  return (
                    <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image.getDirectURL()}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(BigInt(item.productId))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) - 1)}
                              disabled={Number(item.quantity) <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity.toString()}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ${((Number(effectivePrice) * Number(item.quantity)) / 100).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${(Number(effectivePrice) / 100).toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {couponsEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon-code"
                      placeholder="Enter coupon code..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || !!appliedCoupon || validateCouponMutation.isPending}
                      variant="outline"
                    >
                      {validateCouponMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">Coupon Applied: {appliedCoupon.code}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode('');
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!couponsEnabled && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Coupons are currently disabled store-wide
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${(discountAmount / 100).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={createOrder.isPending || !shopActive}
                className="w-full"
                size="lg"
              >
                {createOrder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!identity ? 'Login to Checkout' : 'Complete Order'}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
