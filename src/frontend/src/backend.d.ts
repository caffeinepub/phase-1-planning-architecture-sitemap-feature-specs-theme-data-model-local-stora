import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdminLoginAttempt {
    id: bigint;
    principal: Principal;
    timestamp: bigint;
    successful: boolean;
}
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
export interface AdminAccessLogEntry {
    id: bigint;
    principal: Principal;
    timestamp: bigint;
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
export interface UserProfile {
    name: string;
    email: string;
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
    assignAdminRole(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAdminAccessLog(): Promise<Array<AdminAccessLogEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEvents(): Promise<Array<Event>>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getLoginAttempts(): Promise<Array<AdminLoginAttempt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    logEvent(message: string, level: string): Promise<void>;
    removeAdminRole(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    verifyAdminAccess(inputCode: string): Promise<boolean>;
}
