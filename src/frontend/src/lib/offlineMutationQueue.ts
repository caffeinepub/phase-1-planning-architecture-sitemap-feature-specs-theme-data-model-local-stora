import { getStorageItem, setStorageItem, removeStorageItem } from './localStorage';

const QUEUE_STORAGE_KEY = 'app_offlineMutationQueue_v1';
const QUEUE_VERSION = 1;

export type MutationType = 
  | 'saveArtifact'
  | 'removeSavedArtifact'
  | 'createOrder'
  | 'createProduct'
  | 'editProduct'
  | 'updateProductStock'
  | 'assignAdminRole'
  | 'removeAdminRole';

export interface QueuedMutation {
  id: string;
  type: MutationType;
  params: any;
  timestamp: number;
  retryCount: number;
  lastError?: string;
  failed?: boolean;
}

interface QueueState {
  mutations: QueuedMutation[];
}

export function getQueue(): QueuedMutation[] {
  const state = getStorageItem<QueueState>(QUEUE_STORAGE_KEY, QUEUE_VERSION);
  return state?.mutations || [];
}

export function enqueueMutation(type: MutationType, params: any): string {
  const queue = getQueue();
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const mutation: QueuedMutation = {
    id,
    type,
    params,
    timestamp: Date.now(),
    retryCount: 0,
  };
  
  const newQueue = [...queue, mutation];
  setStorageItem(QUEUE_STORAGE_KEY, { mutations: newQueue }, { version: QUEUE_VERSION });
  
  return id;
}

export function dequeueMutation(id: string): void {
  const queue = getQueue();
  const newQueue = queue.filter((m) => m.id !== id);
  setStorageItem(QUEUE_STORAGE_KEY, { mutations: newQueue }, { version: QUEUE_VERSION });
}

export function incrementRetryCount(id: string, error?: string): void {
  const queue = getQueue();
  const newQueue = queue.map((m) => 
    m.id === id ? { ...m, retryCount: m.retryCount + 1, lastError: error } : m
  );
  setStorageItem(QUEUE_STORAGE_KEY, { mutations: newQueue }, { version: QUEUE_VERSION });
}

export function markAsFailed(id: string, error: string): void {
  const queue = getQueue();
  const newQueue = queue.map((m) => 
    m.id === id ? { ...m, failed: true, lastError: error } : m
  );
  setStorageItem(QUEUE_STORAGE_KEY, { mutations: newQueue }, { version: QUEUE_VERSION });
}

export function clearFailedMutations(): void {
  const queue = getQueue();
  const newQueue = queue.filter((m) => !m.failed);
  setStorageItem(QUEUE_STORAGE_KEY, { mutations: newQueue }, { version: QUEUE_VERSION });
}

export function removeMutation(id: string): void {
  dequeueMutation(id);
}

export function clearQueue(): void {
  removeStorageItem(QUEUE_STORAGE_KEY);
}
