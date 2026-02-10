import { useEffect, useState, useCallback } from 'react';
import { useActor } from './useActor';
import { 
  getQueue, 
  dequeueMutation, 
  incrementRetryCount, 
  markAsFailed,
  type QueuedMutation 
} from '../lib/offlineMutationQueue';
import { useQueryClient } from '@tanstack/react-query';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

const MAX_RETRIES = 3;

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export function useOfflineMutationReplay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [queueLength, setQueueLength] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const isRetryableError = (error: any): boolean => {
    const errorMsg = error?.message || String(error);
    // Network errors and timeouts are retryable
    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
      return true;
    }
    // Authorization errors are not retryable
    if (errorMsg.includes('Unauthorized') || errorMsg.includes('permission')) {
      return false;
    }
    // Default to retryable for unknown errors
    return true;
  };

  const replayMutation = useCallback(async (mutation: QueuedMutation) => {
    if (!actor) return false;

    try {
      switch (mutation.type) {
        case 'saveArtifact':
          await actor.saveArtifact(BigInt(mutation.params.productId));
          queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
          break;
        
        case 'removeSavedArtifact':
          await actor.removeSavedArtifact(BigInt(mutation.params.productId));
          queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
          break;
        
        case 'createOrder':
          await actor.createOrder(
            mutation.params.productIds.map((id: string) => BigInt(id)),
            BigInt(mutation.params.totalAmount)
          );
          queryClient.invalidateQueries({ queryKey: ['myOrders'] });
          queryClient.invalidateQueries({ queryKey: ['allOrders'] });
          break;
        
        case 'createProduct':
          await actor.createProduct(
            mutation.params.name,
            mutation.params.description,
            BigInt(mutation.params.price),
            BigInt(mutation.params.stock)
          );
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;
        
        case 'editProduct':
          await actor.editProduct(
            BigInt(mutation.params.productId),
            mutation.params.name,
            mutation.params.description,
            BigInt(mutation.params.price)
          );
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['product', mutation.params.productId] });
          break;
        
        case 'updateProductStock':
          await actor.updateProductStock(
            BigInt(mutation.params.productId),
            BigInt(mutation.params.newStock)
          );
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['product', mutation.params.productId] });
          break;
        
        case 'assignAdminRole':
          await actor.assignAdminRole(Principal.fromText(mutation.params.userPrincipal));
          queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
          break;
        
        case 'removeAdminRole':
          await actor.removeAdminRole(Principal.fromText(mutation.params.userPrincipal));
          queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
          break;
        
        case 'createFeedback':
          await actor.createFeedback(
            Principal.fromText(mutation.params.userId),
            mutation.params.message
          );
          queryClient.invalidateQueries({ queryKey: ['feedback'] });
          toast.success('Your feedback has been submitted successfully!');
          break;
        
        default:
          console.warn('Unknown mutation type:', mutation.type);
          return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error replaying mutation:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (!isRetryableError(error)) {
        markAsFailed(mutation.id, errorMsg);
      } else {
        incrementRetryCount(mutation.id, errorMsg);
      }
      
      return false;
    }
  }, [actor, queryClient]);

  const processQueue = useCallback(async () => {
    if (!actor) return;

    const queue = getQueue();
    if (queue.length === 0) {
      setStatus('idle');
      setQueueLength(0);
      setFailedCount(0);
      return;
    }

    setStatus('syncing');
    setQueueLength(queue.length);
    setLastError(null);

    let successCount = 0;
    let errorCount = 0;
    let permanentFailures = 0;

    for (const mutation of queue) {
      // Skip already failed mutations
      if (mutation.failed) {
        permanentFailures++;
        continue;
      }

      // Mark as permanently failed if max retries reached
      if (mutation.retryCount >= MAX_RETRIES) {
        markAsFailed(mutation.id, mutation.lastError || 'Max retries exceeded');
        permanentFailures++;
        continue;
      }

      const success = await replayMutation(mutation);
      
      if (success) {
        dequeueMutation(mutation.id);
        successCount++;
      } else {
        errorCount++;
      }
    }

    const remainingQueue = getQueue();
    const failedMutations = remainingQueue.filter(m => m.failed);
    setQueueLength(remainingQueue.length);
    setFailedCount(failedMutations.length);

    if (remainingQueue.length === 0) {
      setStatus('synced');
      setTimeout(() => setStatus('idle'), 3000);
    } else if (failedMutations.length > 0) {
      setStatus('error');
      setLastError(`${failedMutations.length} action(s) failed permanently`);
    } else {
      setStatus('error');
      setLastError(`${errorCount} action(s) failed (will retry)`);
    }
  }, [actor, replayMutation]);

  useEffect(() => {
    if (actor) {
      processQueue();
    }
  }, [actor, processQueue]);

  return {
    status,
    queueLength,
    failedCount,
    lastError,
    processQueue,
  };
}
