import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Testimony {
    id: bigint;
    shortReview?: string;
    starRating?: number;
    content: string;
    video?: ExternalBlob;
    author: string;
    approved: boolean;
    rating?: bigint;
    photo?: ExternalBlob;
}
export interface Event {
    id: bigint;
    principal: Principal;
    level: string;
    message: string;
    timestamp: bigint;
}
export interface AuditLogEntry {
    id: bigint;
    actionType: AuditActionType;
    target?: Principal;
    timestamp: bigint;
    details: string;
    actorPrincipal: Principal;
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
export interface AdminLoginAttempt {
    id: bigint;
    principal: Principal;
    timestamp: bigint;
    successful: boolean;
}
export interface AdminAccessLogEntry {
    id: bigint;
    principal: Principal;
    timestamp: bigint;
    deviceType?: string;
    browserInfo?: string;
}
export interface NotificationCounts {
    newOrders: bigint;
    newMessagesCount: bigint;
    newTestimonies: bigint;
    newQuotes: bigint;
}
export interface AdminPermissions {
    canDeactivateStore: boolean;
    canApplyDiscounts: boolean;
    principal: Principal;
    canCreateOrder: boolean;
    canManageUsers: boolean;
    canCreateProduct: boolean;
    canManageInventory: boolean;
    canProcessRefunds: boolean;
    fullPermissions: boolean;
    canRemoveUsers: boolean;
    canDeleteProduct: boolean;
    isOwner: boolean;
    canViewMetrics: boolean;
    canEditProduct: boolean;
}
export enum AuditActionType {
    adminEdit = "adminEdit",
    adminMessage = "adminMessage",
    adminLogin = "adminLogin",
    orderUpdate = "orderUpdate",
    couponCreate = "couponCreate",
    couponToggle = "couponToggle",
    adminApproval = "adminApproval",
    adminDecline = "adminDecline"
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
export interface backendInterface {
    adminLogin(adminCode: string, codeConfirmed: boolean, browserInfo: string, deviceInfo: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminAccessCode(newCodeConfirmed: string, currentAccessCode: string): Promise<boolean>;
    confirmNewCode(newCode: string, currentCode: string): Promise<boolean>;
    getAdminAccessLog(): Promise<Array<AdminAccessLogEntry>>;
    getAdminAttempts(principal: Principal): Promise<bigint>;
    getAdminNotifications(): Promise<NotificationCounts>;
    getAllAdmins(): Promise<Array<AdminPermissions>>;
    getAllAuditLogEntries(): Promise<Array<AuditLogEntry>>;
    getAllTestimonies(): Promise<Array<Testimony>>;
    getAttemptCount(principal: Principal): Promise<bigint>;
    getAuditLogEntriesByType(actionType: AuditActionType): Promise<Array<AuditLogEntry>>;
    getAuditLogEntriesForActor(actorPrincipal: Principal): Promise<Array<AuditLogEntry>>;
    getAuditLogEntry(id: bigint): Promise<AuditLogEntry | null>;
    getAuditLogStats(): Promise<{
        total: bigint;
        orderUpdateCounts: bigint;
        couponCreateCounts: bigint;
        approvalCounts: bigint;
        messageCounts: bigint;
        editCounts: bigint;
        declineCounts: bigint;
        couponToggleCounts: bigint;
        loginCounts: bigint;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentAdminAccessCode(): Promise<string | null>;
    getCurrentAdminAccessCodeUnmasked(): Promise<string>;
    getEvents(): Promise<Array<Event>>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getLoginAttempts(): Promise<Array<AdminLoginAttempt>>;
    getMaskedAdminAccessCode(): Promise<string>;
    getOnlyVerifiedTestimonies(): Promise<Array<Testimony>>;
    getPermissions(principal: Principal): Promise<AdminPermissions | null>;
    getRecentAuditLogEntries(count: bigint): Promise<Array<AuditLogEntry>>;
    getTestimony(id: bigint): Promise<Testimony | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    isCallerLockedOut(): Promise<boolean>;
    listAdmins(): Promise<Array<AdminPermissions>>;
    logEvent(message: string, level: string): Promise<void>;
    resetAdminAttempts(principal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setOwner(owner: Principal): Promise<void>;
    submitAdminAccessAttempt(accessCode: string, browserInfo: string | null, deviceType: string | null): Promise<string>;
    updateAdminAccessCode(newAccessCode: string): Promise<void>;
    verifyAccessCode(adminAttemptedCode: string): Promise<boolean>;
    verifyAdminAccess(adminAttemptedCode: string, browserInfo: string | null, deviceType: string | null): Promise<boolean>;
}
