import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, Order, SavedArtifact, UserRole, GuildOrder } from '../backend';
import { Principal } from '@dfinity/principal';

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

// User Role Queries
export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
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

// Role Management Mutations (Admin Only)
export function useAssignAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.assignAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useRemoveAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.removeAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userPrincipal: string; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(params.userPrincipal);
      return actor.assignCallerUserRole(principal, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
    },
  });
}

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productId: bigint; name: string; description: string; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProduct(params.productId, params.name, params.description, params.price);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
    },
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

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productIds: bigint[]; totalAmount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(params.productIds, params.totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
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

// Guild Orders Queries
export function useGetAllGuildOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<GuildOrder[]>({
    queryKey: ['guildOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGuildOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateGuildOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; description: string; reward: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGuildOrder(params.title, params.description, params.reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guildOrders'] });
    },
  });
}

export function useUpdateGuildOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { guildOrderId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGuildOrderStatus(params.guildOrderId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guildOrders'] });
    },
  });
}

export function useAssignGuildOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { guildOrderId: bigint; userId: Principal }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignGuildOrder(params.guildOrderId, params.userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guildOrders'] });
    },
  });
}
