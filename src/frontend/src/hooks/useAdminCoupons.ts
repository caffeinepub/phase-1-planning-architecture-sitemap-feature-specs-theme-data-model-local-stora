import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export interface Coupon {
  id: bigint;
  code: string;
  discount: bigint;
  valid: boolean;
}

export function useGetAllCoupons() {
  const { actor } = useActor();

  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor,
  });
}

export function useCreateCoupon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code, discount }: { code: string; discount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
    mutationFn: async (couponId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return Promise.resolve();
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
    mutationFn: async ({ customerId, couponId }: { customerId: string; couponId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(customerId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
  });
}
