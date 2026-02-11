import type { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

// Phase 5B types - to be integrated into backend.d.ts once backend is implemented

export interface RequestAttachment {
  blob: ExternalBlob;
  filename: string;
}

export interface RequestDetail {
  id: bigint;
  submittedBy: Principal;
  name: string;
  email: string;
  description: string;
  pricingPreference: PricingPreference;
  attachments: RequestAttachment[];
  status: RequestStatus;
  actionHistory: RequestAction[];
  convertedOrderId: bigint | null;
}

export interface RequestSummary {
  id: bigint;
  submittedBy: Principal;
  name: string;
  email: string;
  description: string;
  pricingPreference: PricingPreference;
  attachmentCount: bigint;
  status: RequestStatus;
}

export type PricingPreference =
  | { __kind__: 'flexible' }
  | { __kind__: 'range'; value: string };

export type RequestStatus =
  | { __kind__: 'pending' }
  | { __kind__: 'approved' }
  | { __kind__: 'declined' };

export interface RequestAction {
  admin: Principal;
  actionType: string;
  timestamp: bigint;
}

export interface InboxMessage {
  id: bigint;
  sender: Principal;
  body: string;
  attachments: MessageAttachment[];
  timestamp: bigint;
}

export interface InboxCoupon {
  id: bigint;
  sender: Principal;
  code: string;
  discount: bigint;
  timestamp: bigint;
}

export type InboxItem =
  | { __kind__: 'message'; value: InboxMessage }
  | { __kind__: 'coupon'; value: InboxCoupon };

export interface MessageAttachment {
  blob: ExternalBlob;
  filename: string;
}
