import { ExternalBlob } from '../backend';

// Common types used across the application
// These mirror backend types but are defined here for frontend use until backend interface is complete

export type ProductVisibility =
  | { __kind__: 'visible' }
  | { __kind__: 'hidden' }
  | { __kind__: 'outOfStock' };

export type ProductAvailability =
  | { __kind__: 'delivery' }
  | { __kind__: 'pickup' }
  | { __kind__: 'dropOff' };

export interface Product {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  image: ExternalBlob;
  isInStock: boolean;
  availability: ProductAvailability;
  shortDescription: string;
  visibility: ProductVisibility;
  priceOverride: bigint | null;
}
