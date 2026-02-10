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
    content: string;
    video?: ExternalBlob;
    author: string;
    approved: boolean;
    rating?: bigint;
    photo?: ExternalBlob;
}
export type PortfolioCategory = {
    __kind__: "illustration";
    illustration: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "digitalArt";
    digitalArt: null;
} | {
    __kind__: "painting";
    painting: null;
} | {
    __kind__: "sculpture";
    sculpture: null;
} | {
    __kind__: "typography";
    typography: null;
} | {
    __kind__: "photography";
    photography: null;
};
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
export interface GuildOrder {
    id: bigint;
    status: string;
    reward: bigint;
    title: string;
    assignedTo?: Principal;
    description: string;
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
    discountAmount: bigint;
    totalAmount: bigint;
    appliedCouponCode?: string;
}
export interface Feedback {
    id: bigint;
    status: Status;
    userId: Principal;
    message: string;
}
export interface Feature {
    description: string;
    phase: Variant_later_phase1;
}
export interface Event {
    id: bigint;
    principal: Principal;
    level: string;
    message: string;
    timestamp: bigint;
}
export interface CouponValidationResult {
    valid: boolean;
    message: string;
    discount: bigint;
}
export interface Coupon {
    id: bigint;
    valid: boolean;
    code: string;
    discount: bigint;
}
export interface ExpandedProduct {
    id: bigint;
    sharable: boolean;
    productType: string;
    viewCount: bigint;
}
export interface Portfolio {
    id: bigint;
    title: string;
    description: string;
    artworks: Array<bigint>;
    category: PortfolioCategory;
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
    isInStock: boolean;
    name: string;
    description: string;
    availability: Variant_dropOff_pickup_delivery;
    stock: bigint;
    shortDescription: string;
    image: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_dropOff_pickup_delivery {
    dropOff = "dropOff",
    pickup = "pickup",
    delivery = "delivery"
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
    checkoutCart(couponCode: string | null): Promise<bigint>;
    completeFeedback(feedbackId: bigint, admin: Principal, response: string): Promise<void>;
    createCoupon(code: string, discount: bigint, valid: boolean): Promise<bigint>;
    createFeedback(userId: Principal, message: string): Promise<bigint>;
    createGuildOrder(title: string, description: string, reward: bigint): Promise<bigint>;
    createOrder(productIds: Array<bigint>, totalAmount: bigint, couponCode: string | null): Promise<bigint>;
    createPortfolio(title: string, description: string, artworks: Array<bigint>, category: PortfolioCategory): Promise<bigint>;
    createProduct(name: string, description: string, price: bigint, stock: bigint, image: ExternalBlob, isInStock: boolean, availability: Variant_dropOff_pickup_delivery, shortDescription: string): Promise<bigint>;
    createTestimony(author: string, content: string, rating: bigint | null, photo: ExternalBlob | null, video: ExternalBlob | null): Promise<bigint>;
    createUser(name: string, email: string): Promise<bigint>;
    editProduct(productId: bigint, name: string, description: string, price: bigint, image: ExternalBlob, isInStock: boolean, availability: Variant_dropOff_pickup_delivery, shortDescription: string): Promise<void>;
    getAllApprovedTestimonies(): Promise<Array<Testimony>>;
    getAllCoupons(): Promise<Array<Coupon>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllGuildOrders(): Promise<Array<GuildOrder>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllPortfolios(): Promise<Array<Portfolio>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllTestimonies(): Promise<Array<Testimony>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCategoryName(category: PortfolioCategory): Promise<string>;
    getEvents(): Promise<Array<Event>>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getFilteredShopProducts(filters: Array<[string, string]>): Promise<Array<ExpandedProduct>>;
    getGuildOrder(id: bigint): Promise<GuildOrder>;
    getMyOrders(): Promise<Array<Order>>;
    getMySavedArtifacts(): Promise<Array<SavedArtifact>>;
    getOrder(id: bigint): Promise<Order>;
    getPortfolioById(id: bigint): Promise<Portfolio | null>;
    getPortfolioCategories(): Promise<Array<PortfolioCategory>>;
    getPortfoliosByCategory(category: PortfolioCategory): Promise<Array<Portfolio>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByType(productType: string): Promise<Array<ExpandedProduct>>;
    getSavedArtifacts(userId: Principal): Promise<Array<SavedArtifact>>;
    getTestimoniesByRating(rating: bigint): Promise<Array<Testimony>>;
    getUser(id: bigint): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    isCallerOwner(): Promise<boolean>;
    logEvent(message: string, level: string): Promise<void>;
    removeAdminRole(user: Principal): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    removeSavedArtifact(productId: bigint): Promise<void>;
    removeTestimony(id: bigint): Promise<void>;
    reviewFeedback(feedbackId: bigint, admin: Principal, response: string): Promise<void>;
    saveArtifact(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCoupon(id: bigint, code: string, discount: bigint, valid: boolean): Promise<void>;
    updateGuildOrderStatus(guildOrderId: bigint, status: string): Promise<void>;
    updatePortfolio(id: bigint, title: string, description: string, artworks: Array<bigint>, category: PortfolioCategory): Promise<void>;
    updateProductStock(productId: bigint, newStock: bigint): Promise<void>;
    updateTestimony(id: bigint, author: string, content: string, approved: boolean, rating: bigint | null, photo: ExternalBlob | null, video: ExternalBlob | null): Promise<void>;
    validateCoupon(code: string): Promise<CouponValidationResult>;
}
