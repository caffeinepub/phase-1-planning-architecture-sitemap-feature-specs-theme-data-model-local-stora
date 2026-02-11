import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { MessageAttachment } from '../types/phase5b';

export function useGetAdminInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['adminInbox'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented - return empty array
      if (typeof (actor as any).getAdminInbox !== 'function') {
        return [];
      }
      return (actor as any).getAdminInbox();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendAdminMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      content: string;
      attachments: MessageAttachment[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method not yet implemented - throw error
      if (typeof (actor as any).sendAdminMessage !== 'function') {
        throw new Error('Admin messaging not yet supported by backend');
      }

      const principal = Principal.fromText(data.customerId);
      return (actor as any).sendAdminMessage(
        principal,
        data.content,
        data.attachments
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminInbox'] });
      queryClient.invalidateQueries({ queryKey: ['customerInbox'] });
    },
  });
}
