import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Testimony as BackendTestimony } from '../backend';
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
export function useSubmitAdminAccessAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      accessCode, 
      browserInfo, 
      deviceType 
    }: { 
      accessCode: string; 
      browserInfo: string | null; 
      deviceType: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitAdminAccessAttempt(accessCode, browserInfo, deviceType);
    },
    onSuccess: (result) => {
      if (result === 'AdminAccessGranted') {
        queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      }
    },
  });
}

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

export function useUpdateAdminAccessCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentCode, newCode }: { currentCode: string; newCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.changeAdminAccessCode(newCode, currentCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccessLog'] });
      queryClient.invalidateQueries({ queryKey: ['auditLog'] });
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

// Alias for admin usage
export const useGetAllProductsAdmin = useGetAllProducts;

export function useGetProduct() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getProduct(id);
    },
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
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: bigint; product: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Store Config Queries
export function useGetStoreConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      if (!actor) return { isActive: true, enableCoupons: true };
      return (actor as any).getStoreConfig?.() || { isActive: true, enableCoupons: true };
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
      const config = await (actor as any).getStoreConfig?.();
      return config?.isActive ?? true;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetStoreActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setStoreActive?.(isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
      queryClient.invalidateQueries({ queryKey: ['shopActiveState'] });
    },
  });
}

export function useOverrideProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, newPrice }: { productId: bigint; newPrice: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).overrideProductPrice?.(productId, newPrice);
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
      return (actor as any).setProductVisibility?.(productId, visibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

export function useGetCallerOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['callerOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getCallerOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for dashboard usage
export const useGetMyOrders = useGetCallerOrders;

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: any) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['callerOrders'] });
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

export function useGetCouponsActiveState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['couponsActiveState'],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).getCouponsActiveState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useToggleCouponsGlobally() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enable: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).toggleCouponsGlobally(enable);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couponsActiveState'] });
    },
  });
}

// Alias for coupon manager
export const useSetCouponsActiveState = useToggleCouponsGlobally;

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

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: any) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitFeedback(feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export function useReviewFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, response }: { id: bigint; response: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).reviewFeedback(id, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export function useCompleteFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, response }: { id: bigint; response: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).completeFeedback(id, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

// Analytics Queries
export function useGetAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getAnalytics();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAnalyticsSnapshot() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getAnalyticsSnapshot?.() || (actor as any).getAnalytics();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Testimonies Queries
export function useGetAllTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['testimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetVerifiedTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['verifiedTestimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOnlyVerifiedTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for public testimonies page
export const useListTestimonies = useGetVerifiedTestimonies;

export function useCreateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimony: any) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createTestimony(testimony);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedTestimonies'] });
    },
  });
}

// Alias for testimony submission
export const useSubmitTestimony = useCreateTestimony;

export function useApproveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveTestimony(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedTestimonies'] });
    },
  });
}

export function useUnapproveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).unapproveTestimony?.(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      queryClient.invalidateQueries({ queryKey: ['verifiedTestimonies'] });
    },
  });
}

// Requests Queries
export function useGetAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestSummary[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllRequests?.() || [];
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for admin requests tab
export const useListRequests = useGetAllRequests;

export function useGetRequestDetail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getRequestDetail?.(id);
    },
  });
}

export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: any) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitRequest?.(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useApproveRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveRequest?.(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useDeclineRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).declineRequest?.(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useSendMessageToCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, message }: { customerId: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendMessageToCustomer?.(customerId, message);
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
    mutationFn: async ({ customerId, couponCode }: { customerId: Principal; couponCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendCouponToCustomer?.(customerId, couponCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

export function useConvertRequestToOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).convertRequestToOrder?.(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Inbox Queries
export function useGetCustomerInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getCustomerInbox?.() || [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).markMessageAsRead?.(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

// Order Tracking Queries
export function useGetOrderTracking() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getOrderTracking?.(orderId);
    },
  });
}

export function useUpdateOrderTrackingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateOrderTrackingStatus?.(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddOrderLocationUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, location }: { orderId: bigint; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderLocationUpdate?.(orderId, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddOrderPopUpNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, note }: { orderId: bigint; note: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderPopUpNote?.(orderId, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
