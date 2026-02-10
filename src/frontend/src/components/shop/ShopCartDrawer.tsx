import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useGetAllProducts, useCreateOrder, useValidateCoupon, useGetShopActiveState } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Minus, Plus, Trash2, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopCartDrawer({ open, onOpenChange }: ShopCartDrawerProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { items, updateQuantity, removeFromCart, clearCart } = useLocalCart();
  const { data: products = [] } = useGetAllProducts();
  const { data: shopActive = true } = useGetShopActiveState();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const cartProducts = items.map(item => {
    const product = products.find(p => p.id.toString() === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.product.priceOverride || item.product.price;
    return sum + (Number(price) * Number(item.quantity));
  }, 0);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - discount);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const result = await validateCoupon.mutateAsync(couponCode.trim());
      if (result.valid) {
        setAppliedCoupon({
          code: couponCode.trim(),
          discount: Number(result.discount),
        });
        toast.success(result.message);
      } else {
        setAppliedCoupon(null);
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error('Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!identity) {
      toast.error('Please log in to complete your order');
      return;
    }

    if (!shopActive) {
      toast.error('Shop is currently closed');
      return;
    }

    if (cartProducts.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const productIds = cartProducts.map(item => BigInt(item.productId));
      const couponCodeToSend = appliedCoupon?.code || null;
      
      await createOrder.mutateAsync({
        productIds,
        couponCode: couponCodeToSend,
      });

      toast.success('Order placed successfully!');
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      onOpenChange(false);
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>

        {!shopActive && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Shop is currently closed. You cannot place orders at this time.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-y-auto py-4">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartProducts.map((item) => {
                if (!item.product) return null;
                const price = item.product.priceOverride || item.product.price;
                const itemTotal = Number(price) * Number(item.quantity);

                return (
                  <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image.getDirectURL()}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${(Number(price) / 100).toFixed(2)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(BigInt(item.productId))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) - 1)}
                            disabled={Number(item.quantity) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity.toString()}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold">
                          ${(itemTotal / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartProducts.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="coupon">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  disabled={!!appliedCoupon || validatingCoupon}
                />
                {appliedCoupon ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleValidateCoupon}
                    disabled={validatingCoupon}
                  >
                    {validatingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <Badge variant="default" className="mt-2">
                  {appliedCoupon.code} applied
                </Badge>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={createOrder.isPending || !identity || !shopActive}
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !identity ? (
                'Log in to Checkout'
              ) : (
                'Checkout'
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
