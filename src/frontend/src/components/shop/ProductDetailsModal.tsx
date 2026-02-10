import { useState } from 'react';
import { useLocalCart } from '../../hooks/useLocalCart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Truck, Package, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved: boolean;
  isAuthenticated: boolean;
}

export default function ProductDetailsModal({
  product,
  open,
  onOpenChange,
}: ProductDetailsModalProps) {
  const { addToCart } = useLocalCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inStock = product.isInStock && Number(product.stock) > 0;
  const imageUrl = product.image.getDirectURL();
  const effectivePrice = product.priceOverride || product.price;

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error('This product is out of stock');
      return;
    }

    addToCart(product.id, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
    setQuantity(1);
  };

  const getAvailabilityIcon = () => {
    if (product.availability === 'delivery') return <Truck className="h-4 w-4" />;
    if (product.availability === 'pickup') return <Package className="h-4 w-4" />;
    if (product.availability === 'dropOff') return <MapPin className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  const getAvailabilityLabel = () => {
    if (product.availability === 'delivery') return 'Delivery Available';
    if (product.availability === 'pickup') return 'Pickup Available';
    if (product.availability === 'dropOff') return 'Drop-off Available';
    return 'Available';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Product Details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
            {imageUrl && imageUrl !== '/null' && (
              <div className="w-full h-64 rounded-md overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-arcane-gold">
                  ${(Number(effectivePrice) / 100).toFixed(2)}
                </p>
                <Badge
                  variant={inStock ? 'secondary' : 'destructive'}
                  className={inStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
                >
                  {inStock ? `${product.stock.toString()} in stock` : 'Out of Stock'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getAvailabilityIcon()}
                <span>{getAvailabilityLabel()}</span>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.shortDescription && product.shortDescription !== product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Quick Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={Number(product.stock)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border border-border rounded-md bg-background"
                    disabled={!inStock}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
