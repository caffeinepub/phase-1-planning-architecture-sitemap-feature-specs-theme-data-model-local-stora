import { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useGetAllProducts, useValidateCoupon, useCreateOrder } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopCartDrawer({ open, onOpenChange }: ShopCartDrawerProps) {
  const { items, updateQuantity, removeFromCart, clearCart } = useLocalCart();
  const { data: products = [] } = useGetAllProducts();
  const { identity } = useInternetIdentity();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const validateCouponMutation = useValidateCoupon();
  const createOrderMutation = useCreateOrder();

  const isAuthenticated = !!identity;

  const cartWithProducts = useMemo(() => {
    return items.map((item) => {
      const product = products.find((p) => p.id.toString() === item.productId);
      return { ...item, product };
    }).filter((item) => item.product !== undefined);
  }, [items, products]);

  const subtotal = useMemo(() => {
    return cartWithProducts.reduce((sum, item) => {
      return sum + Number(item.product!.price) * item.quantity;
    }, 0);
  }, [cartWithProducts]);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to apply coupons');
      return;
    }

    try {
      const result = await validateCouponMutation.mutateAsync(couponCode.trim());
      if (result.valid) {
        setAppliedCoupon({ code: couponCode.trim(), discount: Number(result.discount) });
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setAppliedCoupon(null);
      }
    } catch (error) {
      toast.error('Failed to validate coupon');
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to complete your order');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const productIds = items.map((item) => BigInt(item.productId));
      const orderId = await createOrderMutation.mutateAsync({
        productIds,
        totalAmount: BigInt(total),
        couponCode: appliedCoupon?.code || null,
      });

      toast.success(`Order #${orderId.toString()} created successfully!`);
      clearCart();
      setAppliedCoupon(null);
      setCouponCode('');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create order');
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
            {items.length === 0
              ? 'Your cart is empty'
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Add items to your cart to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cartWithProducts.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product!.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Number(item.product!.price)} ICP each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(BigInt(item.productId), item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(BigInt(item.productId), item.quantity + 1)}
                          disabled={item.quantity >= Number(item.product!.stock)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto"
                          onClick={() => removeFromCart(BigInt(item.productId))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-arcane-gold">
                        {Number(item.product!.price) * item.quantity} ICP
                      </p>
                      <Badge
                        variant={Number(item.product!.stock) > 0 ? 'secondary' : 'destructive'}
                        className="mt-1"
                      >
                        {Number(item.product!.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              {/* Coupon Code */}
              <div className="space-y-2">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!isAuthenticated || validateCouponMutation.isPending}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!isAuthenticated || validateCouponMutation.isPending || !couponCode.trim()}
                    variant="outline"
                  >
                    Apply
                  </Button>
                </div>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground">Log in to apply coupons</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{subtotal} ICP</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{discount} ICP</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-arcane-gold">{total} ICP</span>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2 sm:flex-col">
              {!isAuthenticated && (
                <p className="text-sm text-destructive text-center">
                  Please log in to complete your order
                </p>
              )}
              <Button
                onClick={handleCheckout}
                disabled={!isAuthenticated || createOrderMutation.isPending || items.length === 0}
                className="w-full"
              >
                {createOrderMutation.isPending ? 'Processing...' : 'Complete Order'}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
