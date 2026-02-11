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

// Admin Access Verification (Phase 6A)
export function useVerifyAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inputCode: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAdminAccess(inputCode);
    },
    onSuccess: () => {
      // Invalidate role queries in case the verification also grants admin role
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

// Admin Login Attempts Query (Phase 6A)
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
      if (!actor) return null;
      return (actor as any).getStoreConfig();
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
      return (actor as any).setStoreActive(isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

export function useSetCouponsEnabled() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setCouponsEnabled(enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeConfig'] });
    },
  });
}

// Analytics (Owner Only)
export function useGetAnalyticsSnapshot() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any>({
    queryKey: ['analyticsSnapshot'],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getAnalyticsSnapshot();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Product Price Override (Owner Only)
export function useSetProductPriceOverride() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: bigint; price: bigint | null }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).setProductPriceOverride(data.productId, data.price !== null ? [data.price] : []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Product Visibility Override (Owner Only)
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
    },
  });
}

// Feedback Queries
export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: { category: string; description: string; contactInfo?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitFeedback(feedback.category, feedback.description, feedback.contactInfo ? [feedback.contactInfo] : []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

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

export function useUpdateFeedbackStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { feedbackId: number; status: string; response?: string }) => {
      if (!actor) throw new Error('Actor not available');
      let statusVariant;
      if (data.status === 'open') {
        statusVariant = { open: null };
      } else if (data.status === 'reviewed') {
        statusVariant = { reviewed: { admin: (actor as any).caller, response: data.response ? [data.response] : [] } };
      } else {
        statusVariant = { completed: { admin: (actor as any).caller, response: data.response || '' } };
      }
      return (actor as any).updateFeedbackStatus(BigInt(data.feedbackId), statusVariant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

// Portfolio Queries
export function useGetAllPortfolios() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['portfolios'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllPortfolios();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePortfolio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolio: { title: string; description: string; artworks: number[]; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      const categoryVariant = portfolio.category === 'painting' ? { painting: null } :
        portfolio.category === 'digitalArt' ? { digitalArt: null } :
        portfolio.category === 'sculpture' ? { sculpture: null } :
        portfolio.category === 'photography' ? { photography: null } :
        portfolio.category === 'illustration' ? { illustration: null } :
        portfolio.category === 'typography' ? { typography: null } :
        { other: portfolio.category };
      return (actor as any).createPortfolio(portfolio.title, portfolio.description, portfolio.artworks.map(BigInt), categoryVariant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useUpdatePortfolio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; title: string; description: string; artworks: number[]; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      const categoryVariant = data.category === 'painting' ? { painting: null } :
        data.category === 'digitalArt' ? { digitalArt: null } :
        data.category === 'sculpture' ? { sculpture: null } :
        data.category === 'photography' ? { photography: null } :
        data.category === 'illustration' ? { illustration: null } :
        data.category === 'typography' ? { typography: null } :
        { other: data.category };
      return (actor as any).updatePortfolio(BigInt(data.id), data.title, data.description, data.artworks.map(BigInt), categoryVariant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Testimony Queries
export function useGetApprovedTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['testimonies', 'approved'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getApprovedTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['testimonies', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for consistency
export const useListTestimonies = useGetAllTestimonies;

export function useSubmitTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimony: { rating?: number; photos: any[]; videos: any[] }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitTestimony(
        testimony.rating !== undefined ? [BigInt(testimony.rating)] : [],
        testimony.photos,
        testimony.videos
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

export function useApproveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonyId: number) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).approveTestimony(BigInt(testimonyId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

export function useRejectTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonyId: number) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).rejectTestimony(BigInt(testimonyId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

export function useCreateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimony: { author: string; content: string; rating?: number; photo?: any; video?: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createTestimony(
        testimony.author,
        testimony.content,
        testimony.rating ? [BigInt(testimony.rating)] : [],
        testimony.photo ? [testimony.photo] : [],
        testimony.video ? [testimony.video] : []
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

export function useUpdateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; author: string; content: string; rating?: number; photo?: any; video?: any }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateTestimony(
        BigInt(data.id),
        data.author,
        data.content,
        data.rating !== undefined ? [BigInt(data.rating)] : [],
        data.photo !== undefined ? [data.photo] : [],
        data.video !== undefined ? [data.video] : []
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
    },
  });
}

// Coupon Queries
export function useValidateCoupon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).validateCoupon(code);
    },
  });
}

// Store state queries (aliases for consistency)
export function useGetShopActiveState() {
  const { data: config } = useGetStoreConfig();
  return { data: config?.isActive ?? true, isLoading: false };
}

export function useGetCouponsActiveState() {
  const { data: config } = useGetStoreConfig();
  return { data: config?.enableCoupons ?? true, isLoading: false };
}

export const useSetShopActiveState = useSetStoreActive;
export const useSetCouponsActiveState = useSetCouponsEnabled;

// Quote Request Queries
export function useGetAllQuoteRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['quoteRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllQuoteRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateQuoteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { name: string; projectDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createQuoteRequest(request.name, request.projectDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
    },
  });
}

export function useUpdateQuoteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; name: string; projectDetails: string; response?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateQuoteRequest(BigInt(data.id), data.name, data.projectDetails, data.response ? [data.response] : []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
    },
  });
}

export function useDeleteQuoteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).deleteQuoteRequest(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
    },
  });
}

export function useRespondToQuoteRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; response: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).respondToQuoteRequest(BigInt(data.id), data.response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quoteRequests'] });
    },
  });
}

// Product Queries
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

export const useGetAllProductsAdmin = useGetAllProducts;

// Order Queries
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
    mutationFn: async (order: { productIds: bigint[]; couponCode?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).createOrder(order.productIds, order.couponCode ? [order.couponCode] : []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

// Order Tracking Queries (Phase 5D)
export function useGetOrderWithTracking() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getOrderWithTracking(orderId);
    },
  });
}

export function useUpdateOrderTrackingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: bigint; newStatus: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).updateOrderTrackingStatus(data.orderId, data.newStatus);
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
    mutationFn: async (data: { orderId: bigint; location: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderLocationUpdate(data.orderId, data.location, data.description);
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
    mutationFn: async (data: { orderId: bigint; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).addOrderPopUpNote(data.orderId, data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Inbox Queries (Phase 5B)
export function useGetCallerInbox() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InboxItem[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getCallerInbox();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for consistency
export const useListCallerInbox = useGetCallerInbox;

// Request Queries (Phase 5A/5B)
export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: Request) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).submitRequest(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

// Alias for consistency
export const useCreateRequest = useSubmitRequest;

export function useGetAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RequestSummary[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for consistency
export const useListAllRequests = useGetAllRequests;

export function useGetRequestDetail() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).getRequestDetail(requestId);
    },
  });
}

// Hook that takes bigint | null and returns query
export function useGetRequestById(requestId: bigint | null) {
  const getDetail = useGetRequestDetail();
  const queryClient = useQueryClient();

  return useQuery<RequestDetail | null>({
    queryKey: ['requestDetail', requestId?.toString()],
    queryFn: async () => {
      if (!requestId) return null;
      return getDetail.mutateAsync(requestId);
    },
    enabled: !!requestId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useDeclineRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { requestId: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).declineRequest(data.requestId, data.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useConvertRequestToOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { requestId: bigint; price: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).convertRequestToOrder(data.requestId, data.price);
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
    mutationFn: async (data: { customerId: Principal; subject: string; body: string; attachments: MessageAttachment[] }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendMessageToCustomer(data.customerId, data.subject, data.body, data.attachments);
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
    mutationFn: async (data: { customerId: Principal; couponCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return (actor as any).sendCouponToCustomer(data.customerId, data.couponCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}

// Price override aliases
export const useOverrideProductPrice = useSetProductPriceOverride;
export const useClearProductPriceOverride = useSetProductPriceOverride;
