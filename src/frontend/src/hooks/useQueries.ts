import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, Order, UserRole, StoreConfig, AdminRole, AnalyticsSnapshot, ProductVisibility, CouponValidationResult, Variant_dropOff_pickup_delivery } from '../backend';
import type { Request, Testimony } from '../types/phase5a';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

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

// Owner Check Query
export function useIsCallerOwner() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isCallerOwner'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerOwner();
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

// Admin Registry Management (Owner Only)
export function useListAdmins() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminRole[]>({
    queryKey: ['adminRegistry'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAdmins();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePromoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.promoteAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistry'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerOwner'] });
    },
  });
}

export function useDemoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userPrincipal);
      return actor.demoteAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistry'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerOwner'] });
    },
  });
}

// Admin Password Management (Owner Only)
export function useSetAdminPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { admin: string; passwordHash: string }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(data.admin);
      return actor.setAdminPassword(principal, data.passwordHash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistry'] });
    },
  });
}

// Store Configuration (Owner Only)
export function useGetStoreConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<StoreConfig>({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      if (!actor) return { isActive: true, enableCoupons: true };
      return actor.getStoreConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetShopActiveState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['shopActiveState'],
    queryFn: async () => {
      if (!actor) return true;
      return actor.getShopActiveState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetShopActiveState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setShopActiveState(isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopActiveState'] });
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useGetCouponsActiveState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['couponsActiveState'],
    queryFn: async () => {
      if (!actor) return true;
      return actor.getCouponsActiveState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetCouponsActiveState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enableCoupons: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setCouponsActiveState(enableCoupons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couponsActiveState'] });
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

// Product Price Override (Owner Only)
export function useOverrideProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: bigint; newPrice: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.overrideProductPrice(data.productId, data.newPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export function useClearProductPriceOverride() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearProductPriceOverride(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

// Product Visibility Management (Owner Only)
export function useSetProductVisibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: bigint; visibility: ProductVisibility }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProductVisibility(data.productId, data.visibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

// Analytics (Owner/Admin Only)
export function useGetAnalyticsSnapshot() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AnalyticsSnapshot>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsSnapshot();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllProductsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProductById(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: bigint; updates: Product }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(data.productId, data.updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
    },
  });
}

// Order Queries
export function useGetMyOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCallerOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productIds: bigint[]; couponCode?: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(data.productIds, data.couponCode || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useValidateCoupon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateCoupon(code);
    },
  });
}

// Request Queries (Phase 5A) - Placeholder until backend is implemented
export function useListRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Replace with actor.listRequests() when backend is ready
      throw new Error('Backend method listRequests not yet implemented');
    },
    enabled: false, // Disabled until backend is ready
  });
}

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Request) => {
      if (!actor) throw new Error('Actor not available');
      // TODO: Replace with actor.createRequest(request) when backend is ready
      throw new Error('Backend method createRequest not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

// Testimony Queries (Phase 5A) - Placeholder until backend is implemented
export function useListTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimony[]>({
    queryKey: ['testimonies'],
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Replace with actor.listTestimonies() when backend is ready
      throw new Error('Backend method listTestimonies not yet implemented');
    },
    enabled: false, // Disabled until backend is ready
  });
}

export function useCreateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimony: Testimony) => {
      if (!actor) throw new Error('Actor not available');
      // TODO: Replace with actor.createTestimony(testimony) when backend is ready
      throw new Error('Backend method createTestimony not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}
