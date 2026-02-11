import type { Principal } from '@dfinity/principal';

// Phase 5D Order Tracking Types

export type TrackingStatus =
  | 'pending'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed';

export const TRACKING_STATUS_LABELS: Record<TrackingStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
};

export const TRACKING_STATUS_ORDER: TrackingStatus[] = [
  'pending',
  'processing',
  'ready_for_pickup',
  'out_for_delivery',
  'completed',
];

export interface TrackingStatusHistoryEntry {
  status: TrackingStatus;
  timestamp: bigint;
  admin: Principal;
}

export interface LocationUpdate {
  location: string;
  timestamp: bigint;
  admin: Principal;
}

export interface PopUpNote {
  message: string;
  timestamp: bigint;
  admin: Principal;
}

export type FulfillmentMethod = 'delivery' | 'pickup' | 'dropOff';

export const FULFILLMENT_METHOD_LABELS: Record<FulfillmentMethod, string> = {
  delivery: 'Delivery',
  pickup: 'Pickup (Ashland/Westwood, KY)',
  dropOff: 'Drop-off (Ashland/Westwood, KY)',
};

export interface OrderTracking {
  currentStatus: TrackingStatus;
  statusHistory: TrackingStatusHistoryEntry[];
  locationUpdates: LocationUpdate[];
  popUpNotes: PopUpNote[];
  fulfillmentMethod: FulfillmentMethod;
}

// Frontend type for orders with tracking (until backend interface is updated)
export interface OrderWithTracking {
  id: bigint;
  userId: Principal;
  productIds: bigint[];
  totalAmount: bigint;
  appliedCouponCode: string | null;
  discountAmount: bigint;
  tracking: OrderTracking;
}

// Helper to get next status in sequence
export function getNextStatus(current: TrackingStatus): TrackingStatus | null {
  const currentIndex = TRACKING_STATUS_ORDER.indexOf(current);
  if (currentIndex === -1 || currentIndex === TRACKING_STATUS_ORDER.length - 1) {
    return null;
  }
  return TRACKING_STATUS_ORDER[currentIndex + 1];
}

// Helper to format timestamp
export function formatTimestamp(timestamp: bigint): string {
  // Convert nanoseconds to milliseconds (IC timestamps are in nanoseconds)
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleString();
}
