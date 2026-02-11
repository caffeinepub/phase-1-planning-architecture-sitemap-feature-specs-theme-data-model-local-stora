import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface AdminNotificationCounts {
  newQuotes: number;
  newOrders: number;
  newTestimonies: number;
  newMessagesCount: number;
}

export function useGetAdminNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminNotificationCounts>({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      if (!actor) {
        return {
          newQuotes: 0,
          newOrders: 0,
          newTestimonies: 0,
          newMessagesCount: 0,
        };
      }

      try {
        const result = await actor.getAdminNotifications();
        return {
          newQuotes: Number(result.newQuotes),
          newOrders: Number(result.newOrders),
          newTestimonies: Number(result.newTestimonies),
          newMessagesCount: Number(result.newMessagesCount),
        };
      } catch (error) {
        console.error('Failed to fetch admin notifications:', error);
        // Return zeros on error instead of breaking the UI
        return {
          newQuotes: 0,
          newOrders: 0,
          newTestimonies: 0,
          newMessagesCount: 0,
        };
      }
    },
    enabled: !!actor && !actorFetching,
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
