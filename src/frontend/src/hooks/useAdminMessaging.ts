import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export interface AdminInboxItem {
  id: bigint;
  customerId: Principal;
  messageType: string;
  content: string;
  isRead: boolean;
}

export function useGetAdminInbox() {
  const { actor } = useActor();

  return useQuery<AdminInboxItem[]>({
    queryKey: ['admin', 'inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useSendAdminMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, message }: { customerId: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(customerId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inbox'] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}
