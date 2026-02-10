import { useEffect, useState } from 'react';
import { useActor } from './useActor';
import { getQueue, dequeueMutation, incrementRetryCount } from '../lib/offlineMutationQueue';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export function useOfflineMutationReplay() {
  const { actor } = useActor();
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const processQueue = async () => {
    if (!actor) return;

    const queue = getQueue();
    if (queue.length === 0) {
      setStatus('idle');
      return;
    }

    setStatus('syncing');
    setQueueLength(queue.length);
    setSyncError(null);

    let hasError = false;
    let failed = 0;

    for (const mutation of queue) {
      try {
        switch (mutation.type) {
          case 'saveArtifact':
            await actor.saveArtifact(BigInt(mutation.params.productId));
            break;
          case 'removeSavedArtifact':
            await actor.removeSavedArtifact(BigInt(mutation.params.productId));
            break;
          case 'createOrder':
            await actor.createOrder(
              mutation.params.productIds.map((id: string) => BigInt(id)),
              BigInt(mutation.params.totalAmount),
              mutation.params.couponCode || null
            );
            break;
          case 'createProduct':
            await actor.createProduct(
              mutation.params.name,
              mutation.params.description,
              BigInt(mutation.params.price),
              BigInt(mutation.params.stock),
              ExternalBlob.fromURL(mutation.params.image),
              mutation.params.isInStock,
              mutation.params.availability,
              mutation.params.shortDescription
            );
            break;
          case 'editProduct':
            await actor.editProduct(
              BigInt(mutation.params.productId),
              mutation.params.name,
              mutation.params.description,
              BigInt(mutation.params.price),
              ExternalBlob.fromURL(mutation.params.image),
              mutation.params.isInStock,
              mutation.params.availability,
              mutation.params.shortDescription
            );
            break;
          case 'updateProductStock':
            await actor.updateProductStock(
              BigInt(mutation.params.productId),
              BigInt(mutation.params.newStock)
            );
            break;
          case 'assignAdminRole':
            await actor.assignAdminRole(Principal.fromText(mutation.params.userPrincipal));
            break;
          case 'removeAdminRole':
            await actor.removeAdminRole(Principal.fromText(mutation.params.userPrincipal));
            break;
          case 'createFeedback':
            await actor.createFeedback(
              Principal.fromText(mutation.params.userId),
              mutation.params.message
            );
            if (mutation.type === 'createFeedback') {
              toast.success('Your feedback has been submitted');
            }
            break;
          default:
            console.warn('Unknown mutation type:', mutation.type);
        }

        dequeueMutation(mutation.id);
      } catch (error) {
        console.error('Failed to replay mutation:', error);
        const errorMessage = error instanceof Error ? error.message : 'Sync failed';
        incrementRetryCount(mutation.id, errorMessage);
        setSyncError(errorMessage);
        hasError = true;
        failed++;
      }
    }

    const remainingQueue = getQueue();
    setQueueLength(remainingQueue.length);
    setFailedCount(failed);

    if (hasError) {
      setStatus('error');
    } else if (remainingQueue.length === 0) {
      setStatus('synced');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (actor) {
      processQueue();
    }
  }, [actor]);

  return {
    status,
    queueLength,
    failedCount,
    lastError: syncError,
    isSyncing: status === 'syncing',
    syncError,
    hasPendingMutations: queueLength > 0,
    processQueue,
  };
}
