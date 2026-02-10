import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, Order, SavedArtifact, UserRole, GuildOrder, Feedback, Portfolio, Testimony, Coupon, ExpandedProduct, PortfolioCategory, CouponValidationResult, Variant_dropOff_pickup_delivery } from '../backend';
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

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
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
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      name: string; 
      description: string; 
      price: bigint; 
      stock: bigint;
      image: ExternalBlob;
      isInStock: boolean;
      availability: Variant_dropOff_pickup_delivery;
      shortDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(
        data.name, 
        data.description, 
        data.price, 
        data.stock,
        data.image,
        data.isInStock,
        data.availability,
        data.shortDescription
      );
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
    mutationFn: async (data: { productId: bigint; newStock: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProductStock(data.productId, data.newStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      productId: bigint; 
      name: string; 
      description: string; 
      price: bigint;
      image: ExternalBlob;
      isInStock: boolean;
      availability: Variant_dropOff_pickup_delivery;
      shortDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editProduct(
        data.productId, 
        data.name, 
        data.description, 
        data.price,
        data.image,
        data.isInStock,
        data.availability,
        data.shortDescription
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      return actor.getMyOrders();
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
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productIds: bigint[]; totalAmount: bigint; couponCode: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(data.productIds, data.totalAmount, data.couponCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

// Saved Artifacts Queries
export function useGetMySavedArtifacts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SavedArtifact[]>({
    queryKey: ['mySavedArtifacts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySavedArtifacts();
    },
    enabled: !!actor && !actorFetching,
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
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GuildOrder[]>({
    queryKey: ['guildOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGuildOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Feedback Queries
export function useGetAllFeedback() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Portfolio Queries
export function useGetAllPortfolios() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Portfolio[]>({
    queryKey: ['portfolios'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolios();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPortfolioCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PortfolioCategory[]>({
    queryKey: ['portfolioCategories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolioCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCategoryName() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (category: PortfolioCategory) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCategoryName(category);
    },
  });
}

export function useCreatePortfolio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      artworks: bigint[];
      category: PortfolioCategory;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPortfolio(data.title, data.description, data.artworks, data.category);
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
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      artworks: bigint[];
      category: PortfolioCategory;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePortfolio(data.id, data.title, data.description, data.artworks, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// Testimony Queries
export function useGetAllApprovedTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimony[]>({
    queryKey: ['approvedTestimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApprovedTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllTestimonies() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimony[]>({
    queryKey: ['allTestimonies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonies();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      author: string;
      content: string;
      rating: bigint | null;
      photo: ExternalBlob | null;
      video: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTestimony(data.author, data.content, data.rating, data.photo, data.video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonies'] });
      queryClient.invalidateQueries({ queryKey: ['allTestimonies'] });
    },
  });
}

export function useUpdateTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      author: string;
      content: string;
      approved: boolean;
      rating: bigint | null;
      photo: ExternalBlob | null;
      video: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestimony(data.id, data.author, data.content, data.approved, data.rating, data.photo, data.video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonies'] });
      queryClient.invalidateQueries({ queryKey: ['allTestimonies'] });
    },
  });
}

export function useRemoveTestimony() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeTestimony(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedTestimonies'] });
      queryClient.invalidateQueries({ queryKey: ['allTestimonies'] });
    },
  });
}

// Coupon Queries
export function useGetAllCoupons() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCoupons();
    },
    enabled: !!actor && !actorFetching,
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
