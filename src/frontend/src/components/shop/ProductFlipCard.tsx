import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Truck, MapPin } from 'lucide-react';
import FlipCard from '../effects/FlipCard';
import type { Product } from '../../types/common';

interface ProductFlipCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductFlipCard({ product, onClick }: ProductFlipCardProps) {
  const inStock = product.isInStock && Number(product.stock) > 0;
  const imageUrl = product.image.getDirectURL();

  const getAvailabilityIcon = () => {
    if (product.availability.__kind__ === 'delivery') return <Truck className="h-4 w-4" />;
    if (product.availability.__kind__ === 'pickup') return <Package className="h-4 w-4" />;
    if (product.availability.__kind__ === 'dropOff') return <MapPin className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  const getAvailabilityLabel = () => {
    if (product.availability.__kind__ === 'delivery') return 'Delivery Available';
    if (product.availability.__kind__ === 'pickup') return 'Pickup Available';
    if (product.availability.__kind__ === 'dropOff') return 'Drop-off Available';
    return 'Available';
  };

  const frontContent = (
    <Card className="border-border/40 h-full">
      <CardHeader className="pb-3">
        {imageUrl && imageUrl !== '/null' && (
          <div className="w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <p className="text-2xl font-bold text-arcane-gold">
            {(Number(product.price) / 100).toFixed(2)} ICP
          </p>
          <Badge
            variant={inStock ? 'secondary' : 'destructive'}
            className={inStock ? 'bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30' : ''}
          >
            {inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Click to flip for details
        </p>
      </CardContent>
    </Card>
  );

  const backContent = (
    <Card className="border-border/40 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {product.shortDescription || product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getAvailabilityIcon()}
          <span>{getAvailabilityLabel()}</span>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Click to flip back
        </p>
      </CardContent>
    </Card>
  );

  return <FlipCard front={frontContent} back={backContent} className="h-full" />;
}
