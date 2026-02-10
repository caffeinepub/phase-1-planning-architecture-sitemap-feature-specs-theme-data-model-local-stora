import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SavedArtifact {
    userId: Principal;
    productId: bigint;
}
export interface User {
    id: bigint;
    name: string;
    email: string;
}
export interface PageFeatures {
    features: Array<Feature>;
    page: string;
}
export interface Feature {
    description: string;
    phase: Variant_later_phase1;
}
export interface Order {
    id: bigint;
    productIds: Array<bigint>;
    userId: Principal;
    totalAmount: bigint;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    price: bigint;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(productIds: Array<bigint>, totalAmount: bigint): Promise<bigint>;
    createProduct(name: string, description: string, price: bigint, stock: bigint): Promise<bigint>;
    createUser(name: string, email: string): Promise<bigint>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getMyOrders(): Promise<Array<Order>>;
    getMySavedArtifacts(): Promise<Array<SavedArtifact>>;
    getOrder(id: bigint): Promise<Order>;
    getProduct(id: bigint): Promise<Product>;
    getSavedArtifacts(userId: Principal): Promise<Array<SavedArtifact>>;
    getUser(id: bigint): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeSavedArtifact(productId: bigint): Promise<void>;
    saveArtifact(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProductStock(productId: bigint, newStock: bigint): Promise<void>;
}
