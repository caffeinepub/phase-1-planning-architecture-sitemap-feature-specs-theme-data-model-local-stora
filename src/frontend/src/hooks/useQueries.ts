import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Testimony as BackendTestimony } from '../backend';
import type { RequestSummary, RequestDetail, MessageAttachment } from '../types/phase5b';
import { Principal } from '@dfinity/principal';
import type { AdminPermissions } from '../backend';
import type { Product, ProductVisibility } from '../types/common';

export interface InboxItem {
  id: bigint;
  customerId: Principal;
  messageType: string;
  content: string;
  isRead: boolean;
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<any>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: any) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User Role Queries
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<any>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0, // Always refetch to ensure fresh role data
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetCallerPermissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminPermissions | null>({
    queryKey: ['callerPermissions'],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0, // Always refetch to ensure fresh permission data
  });
}

export function useIsCallerOwner() {
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return false;
    },
    enabled: !!actor,
  });
}

// Admin Status Query - checks if caller has admin privileges
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0, // Always refetch to ensure fresh admin status
    retry: false,
  });
}

// Admin Access Queries
export function useSubmitAdminAccessAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accessCode,
      browserInfo,
      deviceType,
    }: {
      accessCode: string;
      browserInfo: string | null;
      deviceType: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAdminAccessAttempt(accessCode, browserInfo, deviceType);
    },
    onSuccess: async (result) => {
      // Only invalidate if access was granted
      if (result === 'Access Granted') {
        // Invalidate and refetch role/permission queries
        await queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        await queryClient.invalidateQueries({ queryKey: ['callerPermissions'] });
        await queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
        await queryClient.invalidateQueries({ queryKey: ['adminEntryLockoutStatus'] });
      }
    },
  });
}

export function useGetAdminEntryLockoutStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminEntryLockoutStatus'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerLockedOut();
      } catch (error) {
        console.error('Error checking lockout status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
  });
}

// Testimony Queries
export function useGetAllTestimonies() {
  const { actor } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['allTestimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonies();
    },
    enabled: !!actor,
  });
}

export function useGetVerifiedTestimonies() {
  const { actor } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['verifiedTestimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOnlyVerifiedTestimonies();
    },
    enabled: !!actor,
  });
}

// Admin Notification Queries
export function useGetAdminNotifications() {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      if (!actor) {
        return {
          newQuotes: BigInt(0),
          newOrders: BigInt(0),
          newTestimonies: BigInt(0),
          newMessagesCount: BigInt(0),
        };
      }
      try {
        return await actor.getAdminNotifications();
      } catch (error) {
        console.error('Error fetching admin notifications:', error);
        return {
          newQuotes: BigInt(0),
          newOrders: BigInt(0),
          newTestimonies: BigInt(0),
          newMessagesCount: BigInt(0),
        };
      }
    },
    enabled: !!actor,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
