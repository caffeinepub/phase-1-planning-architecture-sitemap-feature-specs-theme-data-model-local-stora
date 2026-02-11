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
    onSuccess: (result) => {
      // Only invalidate if access was granted
      if (result === 'Access Granted') {
        queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
        queryClient.invalidateQueries({ queryKey: ['callerPermissions'] });
      }
    },
  });
}

export function useGetAdminEntryLockoutStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminEntryLockout'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerLockedOut();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMaskedAdminAccessCode() {
  const { actor } = useActor();

  return useQuery<string>({
    queryKey: ['maskedAdminAccessCode'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMaskedAdminAccessCode();
    },
    enabled: !!actor,
  });
}

export function useUpdateAdminAccessCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ newCode, currentCode }: { newCode: string; currentCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.confirmNewCode(newCode, currentCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maskedAdminAccessCode'] });
    },
  });
}

export function useGetAdminAccessLog() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['adminAccessLog'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminAccessLog();
    },
    enabled: !!actor,
  });
}

export function useGetLoginAttempts() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['loginAttempts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLoginAttempts();
    },
    enabled: !!actor,
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useGetAllProductsAdmin() {
  const { actor } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'admin'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

// Testimony Queries
export function useGetAllTestimonies() {
  const { actor } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['testimonies', 'all'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTestimonies();
    },
    enabled: !!actor,
  });
}

export function useListTestimonies() {
  const { actor } = useActor();

  return useQuery<BackendTestimony[]>({
    queryKey: ['testimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonies();
    },
    enabled: !!actor,
  });
}

export function useApproveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

export function useSubmitTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimony: any) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

// Order Queries
export function useGetAllOrders() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useGetMyOrders() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Order Tracking Queries
export function useUpdateOrderTrackingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
      return Promise.resolve();
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
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Request Queries
export function useListRequests() {
  const { actor } = useActor();

  return useQuery<RequestSummary[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useGetRequestDetail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return null as RequestDetail | null;
    },
  });
}

export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: any) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
      return Promise.resolve();
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
      return Promise.resolve();
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
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Feedback Queries
export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: any) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export function useGetAllFeedback() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

// Portfolio Queries
export function useGetAllPortfolios() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['portfolios'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

// Coupon Queries
export function useGetAllCoupons() {
  const { actor } = useActor();

  return useQuery<any[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useValidateCoupon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (couponCode: string) => {
      if (!actor) throw new Error('Actor not available');
      return { valid: false, discount: 0n, message: 'Coupon validation not implemented' };
    },
  });
}

export function useGetCouponsActiveState() {
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['couponsActiveState'],
    queryFn: async () => {
      if (!actor) return true;
      return true;
    },
    enabled: !!actor,
  });
}

export function useSetCouponsActiveState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['couponsActiveState'] });
    },
  });
}

// Admin Queries
export function useGetAllAdmins() {
  const { actor } = useActor();

  return useQuery<AdminPermissions[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllAdmins();
    },
    enabled: !!actor,
  });
}

export function useListAdmins() {
  const { actor } = useActor();

  return useQuery<AdminPermissions[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAdmins();
    },
    enabled: !!actor,
  });
}

export function usePromoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useDemoteAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useUpdateAdminPermissions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, permissions }: { principal: Principal; permissions: Partial<AdminPermissions> }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useSetAdminPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, password }: { principal: Principal; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
}

export function useGetAdminNotifications() {
  const { actor } = useActor();

  return useQuery<any>({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      if (!actor) return { newQuotes: 0n, newOrders: 0n, newTestimonies: 0n, newMessagesCount: 0n };
      try {
        return await actor.getAdminNotifications();
      } catch (error) {
        return { newQuotes: 0n, newOrders: 0n, newTestimonies: 0n, newMessagesCount: 0n };
      }
    },
    enabled: !!actor,
  });
}

// Inbox Queries
export function useGetInbox() {
  const { actor } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useGetCustomerInbox() {
  const { actor } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['customerInbox'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useMarkMessageAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['customerInbox'] });
    },
  });
}

// Shop Control Queries
export function useOverrideProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, price }: { productId: bigint; price: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
    mutationFn: async ({ productId, visibility }: { productId: bigint; visibility: ProductVisibility }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useGetStoreConfig() {
  const { actor } = useActor();

  return useQuery<any>({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      if (!actor) return { isActive: true, enableCoupons: true };
      return { isActive: true, enableCoupons: true };
    },
    enabled: !!actor,
  });
}

export function useSetStoreActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

export function useGetShopActiveState() {
  const { actor } = useActor();

  return useQuery<boolean>({
    queryKey: ['shopActiveState'],
    queryFn: async () => {
      if (!actor) return true;
      return true;
    },
    enabled: !!actor,
  });
}

// Analytics Queries
export function useGetAnalyticsSnapshot() {
  const { actor } = useActor();

  return useQuery<any>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) return {
        totalOrders: 0n,
        totalRevenue: 0n,
        activeProducts: 0n,
        totalUsers: 0n,
      };
      return {
        totalOrders: 0n,
        totalRevenue: 0n,
        activeProducts: 0n,
        totalUsers: 0n,
      };
    },
    enabled: !!actor,
  });
}
