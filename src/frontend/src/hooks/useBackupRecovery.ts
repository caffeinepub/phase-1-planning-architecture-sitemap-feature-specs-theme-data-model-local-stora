import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Temporary type definition until backend implements BackupMetadata
interface BackupMetadata {
  id: bigint;
  timestamp: bigint;
  dataSize: bigint;
}

export function useGetBackupMetadata() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BackupMetadata | null>({
    queryKey: ['backupMetadata'],
    queryFn: async () => {
      if (!actor) return null;
      // Check if method exists before calling
      if (typeof (actor as any).getBackupMetadata === 'function') {
        return (actor as any).getBackupMetadata();
      }
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Check if method exists before calling
      if (typeof (actor as any).createBackup === 'function') {
        return (actor as any).createBackup();
      }
      throw new Error('Backup functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backupMetadata'] });
    },
  });
}

export function useRestoreFromBackup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (backupId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Check if method exists before calling
      if (typeof (actor as any).restoreFromBackup === 'function') {
        return (actor as any).restoreFromBackup(backupId);
      }
      throw new Error('Restore functionality not yet implemented in backend');
    },
    onSuccess: () => {
      // Invalidate all queries since restore affects all data
      queryClient.invalidateQueries({ queryKey: ['backupMetadata'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['adminRegistry'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}
