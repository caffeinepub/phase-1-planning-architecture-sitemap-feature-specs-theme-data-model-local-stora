import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useQueuedSaveArtifact, useQueuedRemoveSavedArtifact } from '../../hooks/useQueuedMutations';
import { useLocalCart } from '../../hooks/useLocalCart';
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
  isSaved,
  isAuthenticated,
}: ProductDetailsModalProps) {
  const saveArtifact = useQueuedSaveArtifact();
  const removeSavedArtifact = useQueuedRemoveSavedArtifact();
  const { addToCart } = useLocalCart();

  if (!product) return null;

  const inStock = Number(product.stock) > 0;

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save artifacts');
      return;
    }

    try {
      if (isSaved) {
        await removeSavedArtifact.mutateAsync(product.id);
        toast.success('Removed from saved artifacts');
      } else {
        await saveArtifact.mutateAsync(product.id);
        toast.success('Added to saved artifacts');
      }
    } catch (error: any) {
      if (error.message === 'Queued for offline sync') {
        toast.info(
          isSaved ? 'Remove action queued' : 'Save action queued',
          { description: 'Will sync when you\'re back online.' }
        );
      } else {
        toast.error(
          isSaved ? 'Failed to remove artifact' : 'Failed to save artifact',
          { description: error.message || 'Please try again.' }
        );
      }
    }
  };

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error('This item is out of stock');
      return;
    }

    addToCart(product.id, 1);
    toast.success('Added to cart');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">{product.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Product details for {product.name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Price and Stock */}
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-arcane-gold">
                  {Number(product.price)} ICP
                </p>
                <Badge
                  variant={inStock ? 'secondary' : 'destructive'}
                  className={inStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
                >
                  {inStock ? `${product.stock.toString()} in stock` : 'Out of Stock'}
                </Badge>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveToggle}
                  disabled={!isAuthenticated || saveArtifact.isPending || removeSavedArtifact.isPending}
                  className="gap-2"
                  size="lg"
                  aria-label={isSaved ? 'Remove from saved artifacts' : 'Save artifact'}
                >
                  {saveArtifact.isPending || removeSavedArtifact.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-arcane-gold' : ''}`} />
                  )}
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">
                  Log in to save artifacts to your collection
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
