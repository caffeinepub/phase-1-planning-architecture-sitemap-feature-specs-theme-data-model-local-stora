import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { InboxItem } from './useQueries';

export function useGetAdminInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['adminInbox'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendAdminMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      message,
    }: {
      customerId: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(customerId);
      return (actor as any).sendMessageToCustomer(
        principal,
        message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInbox'] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
  });
}
