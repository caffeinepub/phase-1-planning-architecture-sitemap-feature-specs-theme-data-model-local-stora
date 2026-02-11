import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Event {
    id: bigint;
    principal: Principal;
    level: string;
    message: string;
    timestamp: bigint;
}
export interface PageFeatures {
    features: Array<Feature>;
    page: string;
}
export interface HealthStatus {
    status: string;
    environment: string;
    build: string;
    deployedVersion: string;
}
export interface Feature {
    description: string;
    phase: Variant_later_phase1;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_later_phase1 {
    later = "later",
    phase1 = "phase1"
}

// Phase 5D Order Tracking Types
export interface TrackingStatusHistoryEntry {
    status: string;
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

export interface OrderTracking {
    currentStatus: string;
    statusHistory: Array<TrackingStatusHistoryEntry>;
    locationUpdates: Array<LocationUpdate>;
    popUpNotes: Array<PopUpNote>;
    fulfillmentMethod: string;
}

export interface OrderWithTracking {
    id: bigint;
    userId: Principal;
    productIds: Array<bigint>;
    totalAmount: bigint;
    appliedCouponCode: string | null;
    discountAmount: bigint;
    tracking: OrderTracking;
}

export interface backendInterface {
    assignAdminRole(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getEvents(): Promise<Array<Event>>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    logEvent(message: string, level: string): Promise<void>;
    removeAdminRole(user: Principal): Promise<void>;
    
    // Phase 5D Order Tracking Methods (to be implemented in backend)
    updateOrderTrackingStatus(orderId: bigint, status: string): Promise<void>;
    addOrderLocationUpdate(orderId: bigint, location: string): Promise<void>;
    addOrderPopUpNote(orderId: bigint, message: string): Promise<void>;
}
