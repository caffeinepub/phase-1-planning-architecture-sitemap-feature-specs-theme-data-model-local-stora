import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertCircle } from 'lucide-react';

// TODO: Backend methods not yet implemented
// import { useGetAllProducts, useCreateOrder, useValidateCoupon, useGetStoreConfig } from '../../hooks/useQueries';

interface ShopCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopCartDrawer({ isOpen, onClose }: ShopCartDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This feature requires backend implementation. Coming soon.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
