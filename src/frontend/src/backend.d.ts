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
export interface Event {
    id: bigint;
    principal: Principal;
    level: string;
    message: string;
    timestamp: bigint;
}
export interface GuildOrder {
    id: bigint;
    status: string;
    reward: bigint;
    title: string;
    assignedTo?: Principal;
    description: string;
}
export interface PageFeatures {
    features: Array<Feature>;
    page: string;
}
export interface Feature {
    description: string;
    phase: Variant_later_phase1;
}
export interface Feedback {
    id: bigint;
    status: Status;
    userId: Principal;
    message: string;
}
export interface HealthStatus {
    status: string;
    environment: string;
    build: string;
    deployedVersion: string;
}
export interface Order {
    id: bigint;
    productIds: Array<bigint>;
    userId: Principal;
    totalAmount: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export type Status = {
    __kind__: "open";
    open: null;
} | {
    __kind__: "completed";
    completed: {
        admin: Principal;
        response: string;
    };
} | {
    __kind__: "reviewed";
    reviewed: {
        admin: Principal;
        response?: string;
    };
};
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
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    assignAdminRole(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignGuildOrder(guildOrderId: bigint, userId: Principal): Promise<void>;
    checkoutCart(): Promise<bigint>;
    completeFeedback(feedbackId: bigint, admin: Principal, response: string): Promise<void>;
    createFeedback(userId: Principal, message: string): Promise<bigint>;
    createGuildOrder(title: string, description: string, reward: bigint): Promise<bigint>;
    createOrder(productIds: Array<bigint>, totalAmount: bigint): Promise<bigint>;
    createProduct(name: string, description: string, price: bigint, stock: bigint): Promise<bigint>;
    createUser(name: string, email: string): Promise<bigint>;
    editProduct(productId: bigint, name: string, description: string, price: bigint): Promise<void>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllGuildOrders(): Promise<Array<GuildOrder>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getEvents(): Promise<Array<Event>>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getGuildOrder(id: bigint): Promise<GuildOrder>;
    getMyOrders(): Promise<Array<Order>>;
    getMySavedArtifacts(): Promise<Array<SavedArtifact>>;
    getOrder(id: bigint): Promise<Order>;
    getProduct(id: bigint): Promise<Product>;
    getSavedArtifacts(userId: Principal): Promise<Array<SavedArtifact>>;
    getUser(id: bigint): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    logEvent(message: string, level: string): Promise<void>;
    removeAdminRole(user: Principal): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    removeSavedArtifact(productId: bigint): Promise<void>;
    reviewFeedback(feedbackId: bigint, admin: Principal, response: string): Promise<void>;
    saveArtifact(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGuildOrderStatus(guildOrderId: bigint, status: string): Promise<void>;
    updateProductStock(productId: bigint, newStock: bigint): Promise<void>;
}
