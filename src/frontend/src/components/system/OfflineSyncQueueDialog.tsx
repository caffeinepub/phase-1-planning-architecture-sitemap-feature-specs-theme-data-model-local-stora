import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw, AlertCircle, Clock, XCircle } from 'lucide-react';
import { getQueue, removeMutation, clearFailedMutations, type QueuedMutation } from '../../lib/offlineMutationQueue';
import { useOfflineMutationReplay } from '../../hooks/useOfflineMutationReplay';
import { toast } from 'sonner';

interface OfflineSyncQueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OfflineSyncQueueDialog({ open, onOpenChange }: OfflineSyncQueueDialogProps) {
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [confirmClearFailed, setConfirmClearFailed] = useState(false);
  const { processQueue } = useOfflineMutationReplay();

  const refreshQueue = () => {
    setQueue(getQueue());
  };

  const handleRemove = (id: string) => {
    removeMutation(id);
    toast.success('Action removed from queue');
    refreshQueue();
    setConfirmRemove(null);
  };

  const handleClearFailed = () => {
    clearFailedMutations();
    toast.success('Failed actions cleared');
    refreshQueue();
    setConfirmClearFailed(false);
  };

  const handleRetryAll = async () => {
    toast.info('Retrying queued actions...');
    await processQueue();
    refreshQueue();
  };

  const formatMutationType = (type: string): string => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Refresh queue when dialog opens
  useState(() => {
    if (open) {
      refreshQueue();
    }
  });

  const failedMutations = queue.filter(m => m.failed);
  const pendingMutations = queue.filter(m => !m.failed);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Queued Actions</DialogTitle>
            <DialogDescription>
              Manage actions waiting to be synced to the network
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {pendingMutations.length} Pending
              </Badge>
              {failedMutations.length > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {failedMutations.length} Failed
                </Badge>
              )}
            </div>

            {/* Actions */}
            {queue.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryAll}
                  disabled={pendingMutations.length === 0}
                  className="gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry All
                </Button>
                {failedMutations.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmClearFailed(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear Failed
                  </Button>
                )}
              </div>
            )}

            {/* Queue List */}
            {queue.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No queued actions. All changes have been synced.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {queue.map((mutation) => (
                  <div
                    key={mutation.id}
                    className={`p-4 rounded-lg border ${
                      mutation.failed
                        ? 'border-destructive/50 bg-destructive/5'
                        : 'border-border/40 bg-card/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{formatMutationType(mutation.type)}</p>
                          {mutation.failed ? (
                            <Badge variant="destructive" className="text-xs">
                              Failed
                            </Badge>
                          ) : mutation.retryCount > 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              Retry {mutation.retryCount}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(mutation.timestamp)}
                        </p>
                        {mutation.lastError && (
                          <div className="flex items-start gap-2 mt-2">
                            <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-destructive">{mutation.lastError}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmRemove(mutation.id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <AlertDialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Action?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will be permanently removed from the queue and will not be synced.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmRemove && handleRemove(confirmRemove)}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Clear Failed Dialog */}
      <AlertDialog open={confirmClearFailed} onOpenChange={setConfirmClearFailed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Failed Actions?</AlertDialogTitle>
            <AlertDialogDescription>
              All failed actions will be permanently removed from the queue.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearFailed}>
              Clear Failed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
