import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Portfolio } from '../../backend';

interface PortfolioDetailsModalProps {
  portfolio: Portfolio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PortfolioDetailsModal({
  portfolio,
  open,
  onOpenChange,
}: PortfolioDetailsModalProps) {
  if (!portfolio) return null;

  const getCategoryLabel = (category: Portfolio['category']): string => {
    switch (category.__kind__) {
      case 'painting':
        return 'Painting';
      case 'digitalArt':
        return 'Digital Art';
      case 'sculpture':
        return 'Sculpture';
      case 'photography':
        return 'Photography';
      case 'illustration':
        return 'Illustration';
      case 'typography':
        return 'Typography';
      case 'other':
        return category.other || 'Other';
      default:
        return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{portfolio.title}</DialogTitle>
            <Badge variant="secondary" className="bg-arcane-gold/20 text-arcane-gold border-arcane-gold/30 flex-shrink-0">
              {getCategoryLabel(portfolio.category)}
            </Badge>
          </div>
          <DialogDescription className="sr-only">
            Portfolio details for {portfolio.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-foreground leading-relaxed">{portfolio.description}</p>
            </div>

            {portfolio.artworks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Artworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.artworks.map((artworkId) => (
                    <Badge key={Number(artworkId)} variant="outline">
                      Artwork #{artworkId.toString()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
