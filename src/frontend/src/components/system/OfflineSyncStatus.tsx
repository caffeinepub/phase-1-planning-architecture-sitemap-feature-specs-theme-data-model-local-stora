import { useState } from 'react';
import { useOfflineMutationReplay } from '../../hooks/useOfflineMutationReplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, List } from 'lucide-react';
import OfflineSyncQueueDialog from './OfflineSyncQueueDialog';

export default function OfflineSyncStatus() {
  const { status, queueLength, failedCount, lastError, processQueue } = useOfflineMutationReplay();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (status === 'idle' || queueLength === 0) {
    return null;
  }

  const handleRetry = async () => {
    await processQueue();
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 max-w-md">
        {status === 'syncing' && (
          <Alert className="border-arcane-gold/50 bg-background/95 backdrop-blur">
            <Loader2 className="h-4 w-4 animate-spin text-arcane-gold" />
            <AlertDescription className="ml-2 flex items-center justify-between gap-4">
              <span>
                Syncing {queueLength} queued action{queueLength !== 1 ? 's' : ''}...
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="gap-1 h-7 px-2"
              >
                <List className="h-3 w-3" />
                View
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {status === 'synced' && (
          <Alert className="border-green-500/50 bg-background/95 backdrop-blur">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="ml-2">
              All actions synced successfully
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive" className="bg-background/95 backdrop-blur">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 space-y-2">
              <p>
                {lastError || 'Some actions failed to sync'}
                {queueLength > 0 && ` (${queueLength} remaining)`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-1 h-7"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="gap-1 h-7"
                >
                  <List className="h-3 w-3" />
                  View Queue
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <OfflineSyncQueueDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
