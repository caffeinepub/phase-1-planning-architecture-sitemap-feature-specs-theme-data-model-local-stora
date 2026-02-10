import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { enqueueMutation } from '../lib/offlineMutationQueue';
import { Principal } from '@dfinity/principal';
import type { Variant_dropOff_pickup_delivery } from '../backend';
import { ExternalBlob } from '../backend';

export function useQueuedSaveArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) {
        enqueueMutation('saveArtifact', { productId: productId.toString() });
        throw new Error('Queued for offline sync');
      }
      return actor.saveArtifact(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
    },
  });
}

export function useQueuedRemoveSavedArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) {
        enqueueMutation('removeSavedArtifact', { productId: productId.toString() });
        throw new Error('Queued for offline sync');
      }
      return actor.removeSavedArtifact(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySavedArtifacts'] });
    },
  });
}

export function useQueuedCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productIds: bigint[]; totalAmount: bigint; couponCode: string | null }) => {
      if (!actor) {
        enqueueMutation('createOrder', {
          productIds: params.productIds.map(id => id.toString()),
          totalAmount: params.totalAmount.toString(),
          couponCode: params.couponCode,
        });
        throw new Error('Queued for offline sync');
      }
      return actor.createOrder(params.productIds, params.totalAmount, params.couponCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useQueuedCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      name: string; 
      description: string; 
      price: bigint; 
      stock: bigint;
      image: ExternalBlob;
      isInStock: boolean;
      availability: Variant_dropOff_pickup_delivery;
      shortDescription: string;
    }) => {
      if (!actor) {
        enqueueMutation('createProduct', {
          name: params.name,
          description: params.description,
          price: params.price.toString(),
          stock: params.stock.toString(),
          image: params.image.getDirectURL(),
          isInStock: params.isInStock,
          availability: params.availability,
          shortDescription: params.shortDescription,
        });
        throw new Error('Queued for offline sync');
      }
      return actor.createProduct(
        params.name, 
        params.description, 
        params.price, 
        params.stock,
        params.image,
        params.isInStock,
        params.availability,
        params.shortDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useQueuedEditProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      productId: bigint; 
      name: string; 
      description: string; 
      price: bigint;
      image: ExternalBlob;
      isInStock: boolean;
      availability: Variant_dropOff_pickup_delivery;
      shortDescription: string;
    }) => {
      if (!actor) {
        enqueueMutation('editProduct', {
          productId: params.productId.toString(),
          name: params.name,
          description: params.description,
          price: params.price.toString(),
          image: params.image.getDirectURL(),
          isInStock: params.isInStock,
          availability: params.availability,
          shortDescription: params.shortDescription,
        });
        throw new Error('Queued for offline sync');
      }
      return actor.editProduct(
        params.productId, 
        params.name, 
        params.description, 
        params.price,
        params.image,
        params.isInStock,
        params.availability,
        params.shortDescription
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
    },
  });
}

export function useQueuedUpdateProductStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productId: bigint; newStock: bigint }) => {
      if (!actor) {
        enqueueMutation('updateProductStock', {
          productId: params.productId.toString(),
          newStock: params.newStock.toString(),
        });
        throw new Error('Queued for offline sync');
      }
      return actor.updateProductStock(params.productId, params.newStock);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
    },
  });
}

export function useQueuedAssignAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) {
        enqueueMutation('assignAdminRole', { userPrincipal });
        throw new Error('Queued for offline sync');
      }
      const principal = Principal.fromText(userPrincipal);
      return actor.assignAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useQueuedRemoveAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) {
        enqueueMutation('removeAdminRole', { userPrincipal });
        throw new Error('Queued for offline sync');
      }
      const principal = Principal.fromText(userPrincipal);
      return actor.removeAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useQueuedCreateFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; message: string }) => {
      if (!actor) {
        enqueueMutation('createFeedback', params);
        throw new Error('Queued for offline sync');
      }
      const principal = Principal.fromText(params.userId);
      return actor.createFeedback(principal, params.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}
