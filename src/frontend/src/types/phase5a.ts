import type { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

// Phase 5A types - to be moved to backend once implemented
export interface RequestMedia {
  blob: ExternalBlob;
  mediaType: MediaType;
}

export interface Request {
  id: bigint;
  name: string;
  email: string;
  description: string;
  media: RequestMedia[];
  pricingPreference: PricingPreference;
  submittedBy: Principal;
}

export interface TestimonyMedia {
  blob: ExternalBlob;
  description: string;
}

export interface Testimony {
  id: bigint;
  submittedBy: Principal;
  photos: TestimonyMedia[];
  videos: TestimonyMedia[];
  approved: boolean;
}

export enum MediaType {
  photo = 'photo',
  video = 'video',
}

export type PricingPreference =
  | { __kind__: 'flexible' }
  | { __kind__: 'range'; value: string };
