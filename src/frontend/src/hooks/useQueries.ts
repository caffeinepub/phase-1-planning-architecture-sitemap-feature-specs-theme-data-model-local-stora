import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Testimony } from '../types/phase5a';
import type { RequestSummary, RequestDetail, MessageAttachment } from '../types/phase5b';
import { Principal } from '@dfinity/principal';
import type { AdminPermissions } from '../backend';

// Define InboxItem type locally since it's not in backend yet
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

// Admin Access Verification (Phase 6B)
export function useVerifyAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, browserInfo, deviceType }: { code: string; browserInfo: string | null; deviceType: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAdminAccess(code, browserInfo, deviceType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

// Admin Notifications Query
export function useAdminNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      if (!actor) return { newQuotes: 0n, newOrders: 0n, newTestimonies: 0n, newMessagesCount: 0n };
      return actor.getAdminNotifications();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000,
  });
}

// Admin Permissions Queries
export function useGetCallerPermissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminPermissions | null>({
    queryKey: ['callerPermissions'],
    queryFn: async () => {
      if (!actor) return null;
      const principal = await (actor as any).getCallerPrincipal?.() || null;
      if (!principal) return null;
      return actor.getPermissions(principal);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllAdmins() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdminPermissions[]>({
    queryKey: ['allAdmins'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdmins();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListAdmins() {
  return useGetAllAdmins();
}

export function useUpdateAdminPermissions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, permissions }: { principal: Principal; permissions: Partial<AdminPermissions> }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateAdminPermissions(principal, permissions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAdmins'] });
      queryClient.invalidateQueries({ queryKey: ['callerPermissions'] });
    },
  });
}

export function usePromoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).promoteAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAdmins'] });
    },
  });
}

export function useDemoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).demoteAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAdmins'] });
    },
  });
}

export function useSetAdminPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ principal, password }: { principal: Principal; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setAdminPassword(principal, password);
    },
  });
}

// Products Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllProductsAdmin() {
  return useGetAllProducts();
}

export function useOverrideProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, newPrice }: { productId: bigint; newPrice: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).overrideProductPrice(productId, newPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSetProductVisibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, visibility }: { productId: bigint; visibility: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setProductVisibility(productId, visibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Store Config Queries
export function useGetStoreConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      if (!actor) return { isActive: true, enableCoupons: true };
      return (actor as any).getStoreConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetShopActiveState() {
  const { data: config } = useGetStoreConfig();
  return { data: config?.isActive ?? true };
}

export function useSetStoreActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setStoreActive(isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

export function useGetCouponsActiveState() {
  const { data: config } = useGetStoreConfig();
  return { data: config?.enableCoupons ?? true };
}

export function useSetCouponsActiveState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enableCoupons: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setCouponsActive(enableCoupons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

// Orders Queries
export function useGetAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getMyOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: { productIds: bigint[]; totalAmount: bigint; appliedCouponCode?: string; discountAmount?: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createOrder(orderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useUpdateOrderTrackingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateOrderTrackingStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useAddOrderLocationUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, location, description }: { orderId: bigint; location: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderLocationUpdate(orderId, location, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useAddOrderPopUpNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, note }: { orderId: bigint; note: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderPopUpNote(orderId, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

// Coupons Queries
export function useValidateCoupon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).validateCoupon(code);
    },
  });
}

// Feedback Queries
export function useGetAllFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllFeedback();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Analytics Queries
export function useGetAnalyticsSnapshot() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) return { totalOrders: 0n, totalRevenue: 0n, activeProducts: 0n, userCount: 0n };
      return (actor as any).getAnalyticsSnapshot();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Testimonies Queries
export function useListTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimony[]>({
    queryKey: ['testimonies'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as any).getAllTestimonies();
      } catch {
        return await actor.getOnlyVerifiedTestimonies();
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      rating: number;
      description: string;
      photos: Array<{ blob: any; description: string }>;
      videos: Array<{ blob: any; description: string }>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitTestimony(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['searchArtifacts'] });
    },
  });
}

export function useApproveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveTestimony(testimonyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['searchArtifacts'] });
    },
  });
}

// Custom Requests Queries
export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      description: string;
      media: Array<{ blob: any; mediaType: string }>;
      pricingPreference: any;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitRequest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
  });
}

export function useListRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestSummary[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRequestDetail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getRequestDetail(requestId);
    },
  });
}

export function useApproveRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
  });
}

export function useDeclineRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).declineRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
  });
}

export function useConvertRequestToOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, totalAmount }: { requestId: bigint; totalAmount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).convertRequestToOrder(requestId, totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useSendMessageToCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, message }: { customerId: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendMessageToCustomer(customerId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

export function useSendCouponToCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, couponId }: { customerId: Principal; couponId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendCouponToCustomer(customerId, couponId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

// Inbox Queries
export function useGetInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getInbox();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCustomerInbox() {
  return useGetInbox();
}

export function useMarkInboxItemRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).markInboxItemRead(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

export function useMarkMessageAsRead() {
  return useMarkInboxItemRead();
}

// System Settings Queries
export function useGetAuditLog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['auditLog'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAuditLogEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAdminAccessLog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
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

  return useQuery({
    queryKey: ['loginAttempts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoginAttempts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetEvents() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !actorFetching,
  });
}
