import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Persistent stores using var Maps for dynamic allocation
  var users = Map.empty<Nat, User>();
  var products = Map.empty<Nat, Product>();
  var orders = Map.empty<Nat, Order>();
  var guildOrders = Map.empty<Nat, GuildOrder>();
  var savedArtifacts = Map.empty<Principal, [SavedArtifact]>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var userCarts = Map.empty<Principal, [CartItem]>();
  var feedbackStore = Map.empty<Nat, Feedback>();
  var portfolios = Map.empty<Nat, Portfolio>();
  var testimonies = Map.empty<Nat, Testimony>();
  var coupons = Map.empty<Nat, Coupon>();
  var quoteRequests = Map.empty<Nat, QuoteRequest>();
  var expandedProducts = Map.empty<Nat, ExpandedProduct>();
  var adminRegistry = Map.empty<Principal, AdminRole>();
  var adminCredentials = Map.empty<Principal, AdminCredentials>();

  // Legacy persistent variables (should eventually migrate to persistent stores)
  var nextUserId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextGuildOrderId = 1;
  var nextFeedbackId = 1;
  var nextPortfolioId = 1;
  var nextTestimonyId = 1;
  var nextCouponId = 1;
  var nextQuoteRequestId = 1;
  var nextExpandedProductId = 1;

  var ownerPrincipal : ?Principal = null;
  var storeConfig : StoreConfig = {
    isActive = true;
    enableCoupons = true;
  };

  // Health Checks
  public type HealthStatus = {
    status : Text;
    deployedVersion : Text;
    environment : Text;
    build : Text;
  };

  let deploymentInfo : HealthStatus = {
    status = "ok";
    deployedVersion = "1.0.0";
    environment = "production";
    build = "stable";
  };

  public query ({ caller }) func healthCheck() : async HealthStatus {
    deploymentInfo;
  };

  // Event Logging
  public type Event = {
    id : Nat;
    message : Text;
    level : Text;
    timestamp : Nat;
    principal : Principal;
  };

  var nextEventId = 1;
  var events = Map.empty<Nat, Event>();

  public shared ({ caller }) func logEvent(message : Text, level : Text) : async () {
    if (level == "admin" and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Authorization Failed: Only admins can log admin-level events.");
    };

    let validLevels = ["info", "warning", "error", "admin"];
    if (not validLevels.any(func(lvl) { lvl == level })) {
      Runtime.trap("Invalid event level: " # level);
    };

    let event : Event = {
      id = nextEventId;
      message;
      level;
      timestamp = 0; // Use 0 as timestamp until time_import is supported for Internet Computer
      principal = caller;
    };

    events.add(nextEventId, event);
    nextEventId += 1;
  };

  public query ({ caller }) func getEvents() : async [Event] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view events");
    };
    events.values().toArray();
  };

  ////////////////////////////////////////////////////
  // PHASE 1: Feature Specification
  ////////////////////////////////////////////////////

  public type Feature = {
    description : Text;
    phase : {
      #phase1;
      #later;
    };
  };

  public type PageFeatures = {
    page : Text;
    features : [Feature];
  };

  public query func getFeatureSpecification() : async [PageFeatures] {
    [
      {
        page = "Landing Page";
        features = [
          { description = "Showcase art products"; phase = #phase1 },
          { description = "Interactive product carousel"; phase = #later },
          { description = "Real-time inventory display"; phase = #later },
        ];
      },
      {
        page = "Product Pages";
        features = [
          { description = "Detailed product info"; phase = #phase1 },
          { description = "User reviews"; phase = #later },
          { description = "Dynamic price updates"; phase = #later },
        ];
      },
      {
        page = "Inventory Management";
        features = [
          { description = "Stock tracking"; phase = #phase1 },
          { description = "Low-stock alerts"; phase = #later },
          { description = "Automated restocking"; phase = #later },
        ];
      },
      {
        page = "User Profiles";
        features = [
          { description = "Basic profile management"; phase = #phase1 },
          { description = "Order history"; phase = #later },
          { description = "Personalized recommendations"; phase = #later },
        ];
      },
    ];
  };

  ////////////////////////////////////////////////////
  // PHASE 1: Data Architecture (Core Entities)
  ////////////////////////////////////////////////////

  public type User = {
    id : Nat;
    name : Text;
    email : Text;
  };

  public type ProductVisibility = {
    #visible;
    #hidden;
    #outOfStock;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    image : Storage.ExternalBlob;
    isInStock : Bool;
    availability : { #delivery; #pickup; #dropOff };
    shortDescription : Text;
    visibility : ProductVisibility;
    priceOverride : ?Nat;
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    productIds : [Nat];
    totalAmount : Nat;
    appliedCouponCode : ?Text;
    discountAmount : Nat;
  };

  public type SavedArtifact = {
    userId : Principal;
    productId : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type GuildOrder = {
    id : Nat;
    title : Text;
    description : Text;
    reward : Nat;
    status : Text;
    assignedTo : ?Principal;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  public type Feedback = {
    id : Nat;
    userId : Principal;
    message : Text;
    status : Status;
  };

  public type Status = {
    #open;
    #reviewed : {
      admin : Principal;
      response : ?Text;
    };
    #completed : {
      admin : Principal;
      response : Text;
    };
  };

  public type Portfolio = {
    id : Nat;
    title : Text;
    description : Text;
    artworks : [Nat];
    category : PortfolioCategory;
  };

  public type PortfolioCategory = {
    #painting;
    #digitalArt;
    #sculpture;
    #photography;
    #illustration;
    #typography;
    #other : Text;
  };

  public type Testimony = {
    id : Nat;
    author : Text;
    content : Text;
    approved : Bool;
    rating : ?Nat;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
  };

  public type Coupon = {
    id : Nat;
    code : Text;
    discount : Nat;
    valid : Bool;
  };

  public type CouponValidationResult = {
    valid : Bool;
    discount : Nat;
    message : Text;
  };

  public type QuoteRequest = {
    id : Nat;
    name : Text;
    projectDetails : Text;
    response : ?Text;
  };

  public type ExpandedProduct = {
    id : Nat;
    productType : Text;
    sharable : Bool;
    viewCount : Nat;
  };

  public type AdminRole = {
    principal : Principal;
    isOwner : Bool;
  };

  public type StoreConfig = {
    isActive : Bool;
    enableCoupons : Bool;
  };

  public type AdminCredentials = {
    principal : Principal;
    passwordHash : Text;
  };

  ////////////////////////////////////////////////////
  // User Profile Management
  ////////////////////////////////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  ////////////////////////////////////////////////////
  // Deprecated Role Management (Retained for compatibility)
  ////////////////////////////////////////////////////
  public shared ({ caller }) func assignAdminRole(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign admin role");
    };
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func removeAdminRole(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove admin role");
    };
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  public query ({ caller }) func isCallerOwner() : async Bool {
    isOwner(caller);
  };

  ////////////////////////////////////////////////////
  // New Owner and Admin Management System
  ////////////////////////////////////////////////////

  public shared ({ caller }) func setOwner(newOwner : Principal) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can set new owner");
    };
    ownerPrincipal := ?newOwner;
    adminRegistry.add(newOwner, { principal = newOwner; isOwner = true });
  };

  func isOwner(principal : Principal) : Bool {
    switch (ownerPrincipal) {
      case (?owner) { owner == principal };
      case (null) { false };
    };
  };

  func isAdminOrOwner(principal : Principal) : Bool {
    if (isOwner(principal)) {
      return true;
    };
    switch (adminRegistry.get(principal)) {
      case (?_) { true };
      case (null) { false };
    };
  };

  public shared ({ caller }) func promoteAdmin(newAdmin : Principal) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can promote admin");
    };
    adminRegistry.add(newAdmin, { principal = newAdmin; isOwner = false });
  };

  public shared ({ caller }) func demoteAdmin(admin : Principal) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can demote admin");
    };
    if (isOwner(admin)) {
      Runtime.trap("Cannot demote owner");
    };
    adminRegistry.remove(admin);
  };

  public shared ({ caller }) func transferOwnership(newOwner : Principal) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can transfer ownership");
    };
    ownerPrincipal := ?newOwner;
    adminRegistry.add(newOwner, { principal = newOwner; isOwner = true });
  };

  public query ({ caller }) func listAdmins() : async [AdminRole] {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can list admins");
    };
    adminRegistry.values().toArray();
  };

  ////////////////////////////////////////////////////
  // Admin Password Management (Owner-Only)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func setAdminPassword(admin : Principal, passwordHash : Text) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can set admin passwords");
    };
    if (not isAdminOrOwner(admin)) {
      Runtime.trap("Target principal is not an admin");
    };
    adminCredentials.add(admin, { principal = admin; passwordHash });
  };

  public query ({ caller }) func getAdminCredentials(admin : Principal) : async ?AdminCredentials {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can view admin credentials");
    };
    adminCredentials.get(admin);
  };

  ////////////////////////////////////////////////////
  // Publicly Accessible Product Queries (Filtered)
  ////////////////////////////////////////////////////

  func isProductVisible(product : Product) : Bool {
    switch (product.visibility) {
      case (#visible) { true };
      case (#hidden) { false };
      case (#outOfStock) { false };
    };
  };

  func getEffectivePrice(product : Product) : Nat {
    switch (product.priceOverride) {
      case (?override) { override };
      case (null) { product.price };
    };
  };

  public query func listProducts() : async [Product] {
    let visibleProducts = products.values().filter(isProductVisible);
    visibleProducts.toArray();
  };

  public query ({ caller }) func getProductById(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (?product) {
        if (not isProductVisible(product) and not isAdminOrOwner(caller)) {
          Runtime.trap("Product not found");
        };
        product;
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getExpandedProductById(productId : Nat) : async ExpandedProduct {
    switch (expandedProducts.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Expanded Product not found") };
    };
  };

  public query ({ caller }) func listExpandedProducts() : async [ExpandedProduct] {
    expandedProducts.values().toArray();
  };

  public query ({ caller }) func listAllProducts() : async [Product] {
    if (not isAdminOrOwner(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    products.values().toArray();
  };

  ////////////////////////////////////////////////////
  // Store-Only Pricing Management (Owner-Only)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func overrideProductPrice(productId : Nat, newPrice : Nat) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can override pricing");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct : Product = {
          product with priceOverride = ?newPrice;
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func clearProductPriceOverride(productId : Nat) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can clear price overrides");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct : Product = {
          product with priceOverride = null;
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func setProductVisibility(productId : Nat, visibility : ProductVisibility) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can set product visibility");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct : Product = {
          product with visibility;
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  ////////////////////////////////////////////////////
  // Emergency Shop Disable Switch (Owner-Only)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func setShopActiveState(isActive : Bool) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can change store state");
    };
    storeConfig := {
      storeConfig with isActive;
    };
  };

  public query ({ caller }) func getShopActiveState() : async Bool {
    storeConfig.isActive;
  };

  public shared ({ caller }) func setCouponsActiveState(enableCoupons : Bool) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can change coupon state");
    };
    storeConfig := {
      storeConfig with enableCoupons;
    };
  };

  public query ({ caller }) func getCouponsActiveState() : async Bool {
    storeConfig.enableCoupons;
  };

  public query ({ caller }) func getStoreConfig() : async StoreConfig {
    storeConfig;
  };

  ////////////////////////////////////////////////////
  // Shop-Only Product Handling (Owner-Only)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func updateExpandedProduct(productId : Nat, updates : ExpandedProduct) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can update expanded products");
    };

    switch (expandedProducts.get(productId)) {
      case (?currentProduct) {
        let updatedProduct = updates;
        expandedProducts.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Expanded Product not found") };
    };
  };

  public shared ({ caller }) func updateProduct(productId : Nat, updates : Product) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can update products");
    };

    switch (products.get(productId)) {
      case (?_) {
        let updatedProduct = updates;
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func createProduct(product : Product) : async Nat {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can create products");
    };
    let productId = nextProductId;
    let newProduct : Product = {
      product with id = productId;
    };
    products.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  public query ({ caller }) func listExpiredProducts(caller : Principal) : async [ExpandedProduct] {
    if (not isAdminOrOwner(caller)) {
      Runtime.trap("Unauthorized: Only admins can view expired products");
    };
    let expiredProductsIter = expandedProducts.values().filter(func(product) { false });
    expiredProductsIter.toArray();
  };

  ////////////////////////////////////////////////////
  // Coupon Validation (Public with Store Config Check)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func validateCoupon(code : Text) : async CouponValidationResult {
    if (not storeConfig.enableCoupons) {
      return {
        valid = false;
        discount = 0;
        message = "Coupons are currently disabled store-wide";
      };
    };

    let couponIter = coupons.values().filter(
      func(coupon) { coupon.code == code and coupon.valid }
    );
    let couponArray = couponIter.toArray();

    if (couponArray.size() > 0) {
      let coupon = couponArray[0];
      {
        valid = true;
        discount = coupon.discount;
        message = "Coupon applied successfully";
      };
    } else {
      {
        valid = false;
        discount = 0;
        message = "Invalid or expired coupon code";
      };
    };
  };

  public shared ({ caller }) func createCoupon(code : Text, discount : Nat) : async Nat {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can create coupons");
    };
    let couponId = nextCouponId;
    let newCoupon : Coupon = {
      id = couponId;
      code;
      discount;
      valid = true;
    };
    coupons.add(couponId, newCoupon);
    nextCouponId += 1;
    couponId;
  };

  public shared ({ caller }) func updateCoupon(couponId : Nat, valid : Bool) : async () {
    if (not isOwner(caller)) {
      Runtime.trap("Unauthorized: Only owner can update coupons");
    };
    switch (coupons.get(couponId)) {
      case (?coupon) {
        let updatedCoupon : Coupon = {
          coupon with valid;
        };
        coupons.add(couponId, updatedCoupon);
      };
      case (null) { Runtime.trap("Coupon not found") };
    };
  };

  ////////////////////////////////////////////////////
  // Price Lookup (Public - Returns Effective Price)
  ////////////////////////////////////////////////////

  public query ({ caller }) func getEffectiveProductPrice(productId : Nat) : async Nat {
    switch (products.get(productId)) {
      case (?product) {
        if (not isProductVisible(product) and not isAdminOrOwner(caller)) {
          Runtime.trap("Product not found");
        };
        getEffectivePrice(product);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  ////////////////////////////////////////////////////
  // Order Management (Shop-Active Enforcement)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func createOrder(productIds : [Nat], couponCode : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    if (not storeConfig.isActive) {
      Runtime.trap("Store is currently closed for orders");
    };

    var totalAmount : Nat = 0;
    for (productId in productIds.vals()) {
      switch (products.get(productId)) {
        case (?product) {
          if (not isProductVisible(product)) {
            Runtime.trap("Product not available: " # productId.toText());
          };
          totalAmount += getEffectivePrice(product);
        };
        case (null) { Runtime.trap("Product not found: " # productId.toText()) };
      };
    };

    var discountAmount : Nat = 0;
    var appliedCode : ?Text = null;

    switch (couponCode) {
      case (?code) {
        if (storeConfig.enableCoupons) {
          let validation = await validateCoupon(code);
          if (validation.valid) {
            discountAmount := validation.discount;
            appliedCode := ?code;
            if (totalAmount >= discountAmount) {
              totalAmount -= discountAmount;
            } else {
              totalAmount := 0;
            };
          };
        };
      };
      case (null) {};
    };

    let orderId = nextOrderId;
    let newOrder : Order = {
      id = orderId;
      userId = caller;
      productIds;
      totalAmount;
      appliedCouponCode = appliedCode;
      discountAmount;
    };
    orders.add(orderId, newOrder);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (?order) {
        if (order.userId != caller and not isAdminOrOwner(caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func listCallerOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    let userOrders = orders.values().filter(func(order) { order.userId == caller });
    userOrders.toArray();
  };

  public query ({ caller }) func listAllOrders() : async [Order] {
    if (not isAdminOrOwner(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  ////////////////////////////////////////////////////
  // Cart Management (User-Owned)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };

    switch (products.get(productId)) {
      case (?product) {
        if (not isProductVisible(product)) {
          Runtime.trap("Product not available");
        };
      };
      case (null) { Runtime.trap("Product not found") };
    };

    let currentCart = switch (userCarts.get(caller)) {
      case (?cart) { cart };
      case (null) { [] };
    };

    let newItem : CartItem = { productId; quantity };
    let updatedCart = currentCart.concat([newItem]);
    userCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };

    let currentCart = switch (userCarts.get(caller)) {
      case (?cart) { cart };
      case (null) { [] };
    };

    let updatedCart = currentCart.filter(func(item) { item.productId != productId });
    userCarts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCallerCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };
    switch (userCarts.get(caller)) {
      case (?cartItems) { cartItems };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func clearCallerCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };
    userCarts.add(caller, []);
  };

  public query ({ caller }) func getCart(owner : Principal) : async [CartItem] {
    if (caller != owner and not isAdminOrOwner(caller)) {
      Runtime.trap("Unauthorized: Can only view your own cart");
    };
    switch (userCarts.get(owner)) {
      case (?cartItems) { cartItems };
      case (null) { [] };
    };
  };

  ////////////////////////////////////////////////////
  // Analytics (Owner/Admin Only)
  ////////////////////////////////////////////////////

  public type AnalyticsSnapshot = {
    totalOrders : Nat;
    totalRevenue : Nat;
    activeProducts : Nat;
    totalUsers : Nat;
  };

  public query ({ caller }) func getAnalyticsSnapshot() : async AnalyticsSnapshot {
    if (not isAdminOrOwner(caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let totalOrders = orders.size();
    var totalRevenue : Nat = 0;
    for (order in orders.values()) {
      totalRevenue += order.totalAmount;
    };

    let activeProducts = products.values().filter(isProductVisible).size();
    let totalUsers = userProfiles.size();

    {
      totalOrders;
      totalRevenue;
      activeProducts;
      totalUsers;
    };
  };
};

