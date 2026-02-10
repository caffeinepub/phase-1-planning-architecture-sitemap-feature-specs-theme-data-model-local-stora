import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useGetAllProducts } from '../../hooks/useQueries';
import { useQueuedCreateOrder } from '../../hooks/useQueuedMutations';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function InventoryPanel() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalItems } = useLocalCart();
  const { data: products = [] } = useGetAllProducts();
  const { identity } = useInternetIdentity();
  const createOrder = useQueuedCreateOrder();

  // Build product lookup map
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach(p => map.set(p.id.toString(), p));
    return map;
  }, [products]);

  // Expand cart items with product details
  const cartItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      product: productMap.get(item.productId),
    })).filter(item => item.product); // Filter out items with missing products
  }, [items, productMap]);

  // Calculate totals
  const { totalAmount, totalItems } = useMemo(() => {
    let amount = 0;
    let count = 0;
    cartItems.forEach(item => {
      if (item.product) {
        amount += Number(item.product.price) * item.quantity;
        count += item.quantity;
      }
    });
    return { totalAmount: amount, totalItems: count };
  }, [cartItems]);

  const handleCheckout = async () => {
    if (!identity) {
      toast.error('Login required', {
        description: 'Please log in to place an order.',
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty', {
        description: 'Add some items to your cart before checking out.',
      });
      return;
    }

    try {
      const productIds = cartItems.map(item => item.product!.id);
      await createOrder.mutateAsync({
        productIds,
        totalAmount: BigInt(totalAmount),
      });

      clearCart();
      toast.success('Order placed successfully', {
        description: 'Your order has been created and will appear in "My Orders".',
      });
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        clearCart();
        toast.info('Order queued', {
          description: 'Your order will be placed when you\'re back online.',
        });
      } else {
        toast.error('Failed to place order', {
          description: error.message || 'Please try again.',
        });
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-arcane-gold" />
            Your Cart
          </CardTitle>
          <CardDescription>
            Items you've added to your cart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Your cart is empty. Visit the Shop to add mystical artifacts.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-arcane-gold" />
          Your Cart
        </CardTitle>
        <CardDescription>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 p-3 rounded-lg border border-border/40 bg-card/50"
            >
              <div className="flex-1">
                <h4 className="font-medium">{item.product!.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {Number(item.product!.price)} ICP each
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(BigInt(item.productId), item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(BigInt(item.productId), item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-bold text-arcane-gold">
                  {Number(item.product!.price) * item.quantity} ICP
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeFromCart(BigInt(item.productId))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-arcane-gold">{totalAmount} ICP</span>
        </div>

        {/* Checkout Button */}
        <Button
          className="w-full gap-2"
          size="lg"
          onClick={handleCheckout}
          disabled={createOrder.isPending || !identity}
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {identity ? 'Place Order' : 'Login to Checkout'}
            </>
          )}
        </Button>

        {!identity && (
          <Alert variant="destructive">
            <AlertDescription>
              You must be logged in to place an order.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
