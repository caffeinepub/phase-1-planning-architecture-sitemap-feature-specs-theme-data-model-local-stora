import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Request, Testimony } from '../types/phase5a';
import type { RequestSummary, RequestDetail, InboxItem, MessageAttachment } from '../types/phase5b';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<any>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getCallerUserProfile();
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
      return (actor as any).saveCallerUserProfile(profile);
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
      return (actor as any).isCallerOwner();
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

  return useQuery<any[]>({
    queryKey: ['adminRegistry'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAdmins();
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
      return (actor as any).promoteAdmin(principal);
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
      return (actor as any).demoteAdmin(principal);
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
      return (actor as any).setAdminPassword(principal, data.passwordHash);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRegistry'] });
    },
  });
}

// Store Configuration (Owner Only)
export function useGetStoreConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      if (!actor) return { isActive: true, enableCoupons: true };
      return (actor as any).getStoreConfig();
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
      return (actor as any).getShopActiveState();
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
      return (actor as any).setShopActiveState(isActive);
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
      return (actor as any).getCouponsActiveState();
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
      return (actor as any).setCouponsActiveState(enableCoupons);
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
      return (actor as any).overrideProductPrice(data.productId, data.newPrice);
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
      return (actor as any).clearProductPriceOverride(productId);
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
    mutationFn: async (data: { productId: bigint; visibility: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setProductVisibility(data.productId, data.visibility);
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

  return useQuery<any>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getAnalyticsSnapshot();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllProductsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getProductById(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: any) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createProduct(product);
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
    mutationFn: async (data: { productId: bigint; updates: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateProduct(data.productId, data.updates);
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

  return useQuery<any[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listCallerOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAllOrders();
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
      return (actor as any).createOrder(data.productIds, data.couponCode || null);
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
      return (actor as any).validateCoupon(code);
    },
  });
}

// Phase 5B: Admin Request Management
export function useListAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestSummary[]>({
    queryKey: ['allRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listAllRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRequestById(requestId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestDetail | null>({
    queryKey: ['request', requestId?.toString()],
    queryFn: async () => {
      if (!actor || !requestId) return null;
      return (actor as any).getRequestById(requestId);
    },
    enabled: !!actor && !actorFetching && !!requestId,
  });
}

export function useApproveRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveRequest(requestId);
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId.toString()] });
    },
  });
}

export function useDeclineRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).declineRequest(requestId);
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId.toString()] });
    },
  });
}

export function useSendMessageToCustomer() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { customerId: Principal; body: string; attachments: MessageAttachment[] }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendMessageToCustomer(data.customerId, data.body, data.attachments);
    },
  });
}

export function useSendCouponToCustomer() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { customerId: Principal; couponCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendCouponToCustomer(data.customerId, data.couponCode);
    },
  });
}

export function useConvertRequestToOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).convertRequestToOrder(requestId);
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['allRequests'] });
      queryClient.invalidateQueries({ queryKey: ['request', requestId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

// Phase 5B: Customer Inbox
export function useListCallerInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['callerInbox'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listCallerInbox();
    },
    enabled: !!actor && !actorFetching,
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
