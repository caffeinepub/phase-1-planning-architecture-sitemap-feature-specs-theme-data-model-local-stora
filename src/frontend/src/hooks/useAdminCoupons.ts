import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export function useGetAllCoupons() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<any[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not yet implemented - return empty array
      if (typeof (actor as any).getAllCoupons !== 'function') {
        return [];
      }
      return (actor as any).getAllCoupons();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCoupon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { code: string; discount: number }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method not yet implemented - throw error
      if (typeof (actor as any).createCoupon !== 'function') {
        throw new Error('Coupon creation not yet supported by backend');
      }

      return (actor as any).createCoupon(data.code, data.discount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useToggleCouponValidity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { couponId: bigint; valid: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method not yet implemented - throw error
      if (typeof (actor as any).toggleCouponValidity !== 'function') {
        throw new Error('Coupon toggle not yet supported by backend');
      }

      return (actor as any).toggleCouponValidity(data.couponId, data.valid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useSendCouponToCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { customerId: string; couponCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend method not yet implemented - throw error
      if (typeof (actor as any).sendCouponToCustomer !== 'function') {
        throw new Error('Coupon sending not yet supported by backend');
      }

      const principal = Principal.fromText(data.customerId);
      return (actor as any).sendCouponToCustomer(principal, data.couponCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerInbox'] });
    },
  });
}
