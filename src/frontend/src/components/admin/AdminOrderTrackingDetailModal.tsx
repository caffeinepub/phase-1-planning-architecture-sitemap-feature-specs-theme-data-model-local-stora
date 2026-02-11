import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

// TODO: Backend methods not yet implemented
// import {
//   useUpdateOrderTrackingStatus,
//   useAddOrderLocationUpdate,
//   useAddOrderPopUpNote,
// } from '../../hooks/useQueries';

interface AdminOrderTrackingDetailModalProps {
  orderId: bigint | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminOrderTrackingDetailModal({
  orderId,
  isOpen,
  onClose,
}: AdminOrderTrackingDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Tracking Management</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This feature requires backend implementation. Coming soon.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
