import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

// TODO: Backend methods not yet implemented
// import { useSubmitTestimony } from '../../hooks/useQueries';

interface CreateTestimonyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTestimonyDialog({ isOpen, onClose }: CreateTestimonyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Testimony</DialogTitle>
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
