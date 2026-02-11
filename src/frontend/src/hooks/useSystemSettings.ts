import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetHealthCheck() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['healthCheck'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.healthCheck();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAdminAccessLog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['adminAccessLog'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminAccessLog();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLoginAttempts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['adminLoginAttempts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoginAttempts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetEvents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['systemEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !actorFetching,
  });
}
