import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, Order, SavedArtifact, UserRole } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

// Order Queries
export function useGetMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

// Saved Artifacts Queries
export function useGetMySavedArtifacts() {
  const { actor, isFetching } = useActor();

  return useQuery<SavedArtifact[]>({
    queryKey: ['mySavedArtifacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySavedArtifacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveArtifact(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
    },
  });
}

export function useRemoveSavedArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeSavedArtifact(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
    },
  });
}

// Admin Queries
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; description: string; price: bigint; stock: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(params.name, params.description, params.price, params.stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProductStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productId: bigint; newStock: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProductStock(params.productId, params.newStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
