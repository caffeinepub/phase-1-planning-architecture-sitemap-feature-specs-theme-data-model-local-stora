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

// Phase 5B: Request and Inbox types
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

export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
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
    
    // Phase 5B: Request management (admin)
    listAllRequests(): Promise<Array<RequestSummary>>;
    getRequestById(id: bigint): Promise<RequestDetail>;
    approveRequest(id: bigint): Promise<void>;
    declineRequest(id: bigint): Promise<void>;
    sendMessageToCustomer(customerId: Principal, body: string, attachments: MessageAttachment[]): Promise<void>;
    sendCouponToCustomer(customerId: Principal, couponCode: string): Promise<void>;
    convertRequestToOrder(requestId: bigint): Promise<bigint>;
    
    // Phase 5B: Inbox (authenticated user)
    listCallerInbox(): Promise<Array<InboxItem>>;
}
