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
export interface PageFeatures {
    features: Array<Feature>;
    page: string;
}
export interface Event {
    id: bigint;
    principal: Principal;
    level: string;
    message: string;
    timestamp: bigint;
}
export interface Feature {
    description: string;
    phase: Variant_later_phase1;
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
export interface CouponValidationResult {
    valid: boolean;
    message: string;
    discount: bigint;
}
export interface AnalyticsSnapshot {
    totalOrders: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
    activeProducts: bigint;
}
export interface AdminRole {
    principal: Principal;
    isOwner: boolean;
}
export interface ExpandedProduct {
    id: bigint;
    sharable: boolean;
    productType: string;
    viewCount: bigint;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface AdminCredentials {
    principal: Principal;
    passwordHash: string;
}
export interface StoreConfig {
    isActive: boolean;
    enableCoupons: boolean;
}
export interface Product {
    id: bigint;
    isInStock: boolean;
    name: string;
    description: string;
    priceOverride?: bigint;
    availability: Variant_dropOff_pickup_delivery;
    stock: bigint;
    shortDescription: string;
    image: ExternalBlob;
    price: bigint;
    visibility: ProductVisibility;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum ProductVisibility {
    hidden = "hidden",
    outOfStock = "outOfStock",
    visible = "visible"
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
    clearCallerCart(): Promise<void>;
    clearProductPriceOverride(productId: bigint): Promise<void>;
    createCoupon(code: string, discount: bigint): Promise<bigint>;
    createOrder(productIds: Array<bigint>, couponCode: string | null): Promise<bigint>;
    createProduct(product: Product): Promise<bigint>;
    demoteAdmin(admin: Principal): Promise<void>;
    getAdminCredentials(admin: Principal): Promise<AdminCredentials | null>;
    getAnalyticsSnapshot(): Promise<AnalyticsSnapshot>;
    getCallerCart(): Promise<Array<CartItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(owner: Principal): Promise<Array<CartItem>>;
    getCouponsActiveState(): Promise<boolean>;
    getEffectiveProductPrice(productId: bigint): Promise<bigint>;
    getEvents(): Promise<Array<Event>>;
    getExpandedProductById(productId: bigint): Promise<ExpandedProduct>;
    getFeatureSpecification(): Promise<Array<PageFeatures>>;
    getOrder(orderId: bigint): Promise<Order>;
    getProductById(productId: bigint): Promise<Product>;
    getShopActiveState(): Promise<boolean>;
    getStoreConfig(): Promise<StoreConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<HealthStatus>;
    isCallerAdmin(): Promise<boolean>;
    isCallerOwner(): Promise<boolean>;
    listAdmins(): Promise<Array<AdminRole>>;
    listAllOrders(): Promise<Array<Order>>;
    listAllProducts(): Promise<Array<Product>>;
    listCallerOrders(): Promise<Array<Order>>;
    listExpandedProducts(): Promise<Array<ExpandedProduct>>;
    listExpiredProducts(caller: Principal): Promise<Array<ExpandedProduct>>;
    listProducts(): Promise<Array<Product>>;
    logEvent(message: string, level: string): Promise<void>;
    overrideProductPrice(productId: bigint, newPrice: bigint): Promise<void>;
    promoteAdmin(newAdmin: Principal): Promise<void>;
    removeAdminRole(user: Principal): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminPassword(admin: Principal, passwordHash: string): Promise<void>;
    setCouponsActiveState(enableCoupons: boolean): Promise<void>;
    setOwner(newOwner: Principal): Promise<void>;
    setProductVisibility(productId: bigint, visibility: ProductVisibility): Promise<void>;
    setShopActiveState(isActive: boolean): Promise<void>;
    transferOwnership(newOwner: Principal): Promise<void>;
    updateCoupon(couponId: bigint, valid: boolean): Promise<void>;
    updateExpandedProduct(productId: bigint, updates: ExpandedProduct): Promise<void>;
    updateProduct(productId: bigint, updates: Product): Promise<void>;
    validateCoupon(code: string): Promise<CouponValidationResult>;
}
