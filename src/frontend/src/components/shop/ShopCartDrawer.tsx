import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGetAllProducts, useCreateOrder, useValidateCoupon, useGetShopActiveState, useGetCouponsActiveState } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, Tag, X } from 'lucide-react';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Product } from '../../types/common';

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShopCartDrawer({ open, onOpenChange }: ShopCartDrawerProps) {
  const { data: products = [] } = useGetAllProducts();
  const { data: couponsEnabled = true } = useGetCouponsActiveState();
  const { items: cart, updateQuantity, removeFromCart, clearCart } = useLocalCart();
  const { identity } = useInternetIdentity();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Clear applied coupon when coupons are globally disabled
  useEffect(() => {
    if (!couponsEnabled && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode('');
      toast.info('Coupons have been disabled');
    }
  }, [couponsEnabled, appliedCoupon]);

  const cartItems = cart.map(item => {
    const product = products.find((p: Product) => p.id.toString() === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (Number(item.product!.price) * Number(item.quantity));
  }, 0);

  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal - discount;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateCoupon.mutateAsync(couponCode.trim());
      if (result.valid) {
        setAppliedCoupon({ code: couponCode.trim(), discount: Number(result.discount) });
        toast.success(`Coupon applied! ${result.discount}% discount`);
      } else {
        toast.error(result.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
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

    try {
      const productIds = cartItems.map(item => BigInt(item.product!.id));
      const couponCodeToSend = appliedCoupon?.code || undefined;
      
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cart.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)] mt-6">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.product!.image.getDirectURL()}
                    alt={item.product!.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product!.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Number(item.product!.price) / 100} ICP
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity.toString()}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(BigInt(item.productId), Number(item.quantity) + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(BigInt(item.productId))}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Section */}
          {couponsEnabled && cartItems.length > 0 && (
            <div className="py-4 space-y-3">
              <Separator />
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">{appliedCoupon.code}</p>
                      <p className="text-xs text-muted-foreground">{appliedCoupon.discount}% discount</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleRemoveCoupon}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={handleCouponKeyPress}
                    disabled={isValidating}
                  />
                  <Button
                    onClick={handleValidateCoupon}
                    disabled={!couponCode.trim() || isValidating}
                    variant="outline"
                  >
                    {isValidating ? 'Validating...' : 'Apply'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          {cartItems.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{(subtotal / 100).toFixed(2)} ICP</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-{(discount / 100).toFixed(2)} ICP</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{(total / 100).toFixed(2)} ICP</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={createOrder.isPending || !identity}
                className="w-full"
              >
                {createOrder.isPending ? 'Processing...' : identity ? 'Checkout' : 'Login to Checkout'}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
