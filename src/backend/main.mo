import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

    let validLevels = ["info", "warning", "error"];
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

  ////////////////////////////
  // Persistent Storage    //
  ////////////////////////////

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

  ////////////////////////////////////////////////////
  // Role Management
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
    AccessControl.getUserRole(accessControlState, caller) == #admin;
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
  // User Management (Admin Only)
  ////////////////////////////////////////////////////

  public query ({ caller }) func getUser(id : Nat) : async User {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access user records");
    };
    switch (users.get(id)) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func createUser(name : Text, email : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create users");
    };
    let userId = nextUserId;
    nextUserId += 1;
    let user : User = {
      id = userId;
      name = name;
      email = email;
    };
    users.add(userId, user);
    userId;
  };

  ////////////////////////////////////////////////////
  // Product Management
  ////////////////////////////////////////////////////

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByType(productType : Text) : async [ExpandedProduct] {
    let typeIter = expandedProducts.values().filter(
      func(product) { product.productType == productType }
    );
    typeIter.toArray();
  };

  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    price : Nat,
    stock : Nat,
    image : Storage.ExternalBlob,
    isInStock : Bool,
    availability : { #delivery; #pickup; #dropOff },
    shortDescription : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let productId = nextProductId;
    nextProductId += 1;
    let product : Product = {
      id = productId;
      name;
      description;
      price;
      stock;
      image;
      isInStock;
      availability;
      shortDescription;
    };
    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProductStock(productId : Nat, newStock : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update product stock");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name = product.name;
          description = product.description;
          price = product.price;
          stock = newStock;
          image = product.image;
          isInStock = product.isInStock;
          availability = product.availability;
          shortDescription = product.shortDescription;
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func editProduct(
    productId : Nat,
    name : Text,
    description : Text,
    price : Nat,
    image : Storage.ExternalBlob,
    isInStock : Bool,
    availability : { #delivery; #pickup; #dropOff },
    shortDescription : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit products");
    };
    switch (products.get(productId)) {
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          name;
          description;
          price;
          stock = product.stock;
          image;
          isInStock;
          availability;
          shortDescription;
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getFilteredShopProducts(filters : [(Text, Text)]) : async [ExpandedProduct] {
    let filteredValues = expandedProducts.values().filter(
      func(product) {
        filters.all(
          func(filterPair) {
            let (key, val) = filterPair;
            switch (key, val) {
              case ("productType", val) { product.productType == val };
              case ("sharable", "true") { product.sharable };
              case ("sharable", "false") { not product.sharable };
              case ("viewCount", _) { true };
              case (_, _) { true };
            };
          }
        );
      }
    );
    filteredValues.toArray();
  };

  ////////////////////////////////////////////////////
  // Order Management
  ////////////////////////////////////////////////////

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access orders");
    };
    switch (orders.get(id)) {
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access orders");
    };
    let myOrdersIter = orders.values().filter(func(order : Order) : Bool { order.userId == caller });
    myOrdersIter.toArray();
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func createOrder(productIds : [Nat], totalAmount : Nat, couponCode : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    var finalAmount = totalAmount;
    var discountAmount = 0;
    var appliedCode : ?Text = null;

    switch (couponCode) {
      case (?code) {
        let validation = validateCouponInternal(code);
        if (validation.valid) {
          discountAmount := validation.discount;
          if (finalAmount > discountAmount) {
            finalAmount -= discountAmount;
          } else {
            finalAmount := 0;
          };
          appliedCode := ?code;
        };
      };
      case (null) { /* No coupon applied */ };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id = orderId;
      userId = caller;
      productIds;
      totalAmount = finalAmount;
      appliedCouponCode = appliedCode;
      discountAmount;
    };
    orders.add(orderId, order);
    orderId;
  };

  ////////////////////////////////////////////////////
  // Expanded Products Public APIs (Category Mapping)
  ////////////////////////////////////////////////////
  public query ({ caller }) func getPortfolioCategories() : async [PortfolioCategory] {
    [
      #painting,
      #digitalArt,
      #sculpture,
      #photography,
      #illustration,
      #typography,
    ];
  };

  public query ({ caller }) func getCategoryName(category : PortfolioCategory) : async Text {
    switch (category) {
      case (#painting) { "Painting" };
      case (#digitalArt) { "Digital Art" };
      case (#sculpture) { "Sculpture" };
      case (#photography) { "Photography" };
      case (#illustration) { "Illustration" };
      case (#typography) { "Typography" };
      case (#other(description)) { description };
    };
  };

  ////////////////////////////////////////////////////
  // Public Portfolio Methods (Portfolio Page)
  ////////////////////////////////////////////////////
  public query ({ caller }) func getAllPortfolios() : async [Portfolio] {
    portfolios.values().toArray();
  };

  public query ({ caller }) func getPortfolioById(id : Nat) : async ?Portfolio {
    portfolios.get(id);
  };

  public query ({ caller }) func getPortfoliosByCategory(category : PortfolioCategory) : async [Portfolio] {
    let filteredIter = portfolios.values().filter(
      func(portfolio) { portfolio.category == category }
    );
    filteredIter.toArray();
  };

  ////////////////////////////////////////////////////
  // Public Testimonies Methods (Testimonies Page)
  ////////////////////////////////////////////////////
  public query ({ caller }) func getAllApprovedTestimonies() : async [Testimony] {
    let filteredIter = testimonies.values().filter(
      func(testimony) { testimony.approved }
    );
    filteredIter.toArray();
  };

  public query ({ caller }) func getTestimoniesByRating(rating : Nat) : async [Testimony] {
    let filteredIter = testimonies.values().filter(
      func(testimony) {
        switch (testimony.rating) {
          case (?r) { r == rating };
          case (null) { false };
        };
      }
    );
    filteredIter.toArray();
  };

  ////////////////////////////////////////////////////
  // Saved Artifacts Management
  ////////////////////////////////////////////////////

  public query ({ caller }) func getSavedArtifacts(userId : Principal) : async [SavedArtifact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved artifacts");
    };
    if (userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own saved artifacts");
    };
    switch (savedArtifacts.get(userId)) {
      case (?artifacts) { artifacts };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMySavedArtifacts() : async [SavedArtifact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved artifacts");
    };
    switch (savedArtifacts.get(caller)) {
      case (?artifacts) { artifacts };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveArtifact(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save artifacts");
    };
    let artifact : SavedArtifact = {
      userId = caller;
      productId;
    };
    let currentArtifacts = switch (savedArtifacts.get(caller)) {
      case (?artifacts) { artifacts };
      case (null) { [] };
    };
    let updatedArtifacts = currentArtifacts.concat([artifact]);
    savedArtifacts.add(caller, updatedArtifacts);
  };

  public shared ({ caller }) func removeSavedArtifact(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove saved artifacts");
    };
    switch (savedArtifacts.get(caller)) {
      case (?artifacts) {
        let updatedArtifacts = artifacts.filter(func(artifact : SavedArtifact) : Bool {
          artifact.productId != productId;
        });
        savedArtifacts.add(caller, updatedArtifacts);
      };
      case (null) { /* No artifacts to remove */ };
    };
  };

  ////////////////////////////////////////////////////
  // Guild Orders / Quests Management
  ////////////////////////////////////////////////////

  public query func getGuildOrder(id : Nat) : async GuildOrder {
    switch (guildOrders.get(id)) {
      case (?guildOrder) { guildOrder };
      case (null) { Runtime.trap("Guild order not found") };
    };
  };

  public query func getAllGuildOrders() : async [GuildOrder] {
    guildOrders.values().toArray();
  };

  public shared ({ caller }) func createGuildOrder(title : Text, description : Text, reward : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create guild orders");
    };
    let guildOrderId = nextGuildOrderId;
    nextGuildOrderId += 1;
    let guildOrder : GuildOrder = {
      id = guildOrderId;
      title;
      description;
      reward;
      status = "open";
      assignedTo = null;
    };
    guildOrders.add(guildOrderId, guildOrder);
    guildOrderId;
  };

  public shared ({ caller }) func updateGuildOrderStatus(guildOrderId : Nat, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update guild order status");
    };
    switch (guildOrders.get(guildOrderId)) {
      case (?guildOrder) {
        let updatedGuildOrder : GuildOrder = {
          id = guildOrder.id;
          title = guildOrder.title;
          description = guildOrder.description;
          reward = guildOrder.reward;
          status;
          assignedTo = guildOrder.assignedTo;
        };
        guildOrders.add(guildOrderId, updatedGuildOrder);
      };
      case (null) { Runtime.trap("Guild order not found") };
    };
  };

  public shared ({ caller }) func assignGuildOrder(guildOrderId : Nat, userId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign guild orders");
    };
    switch (guildOrders.get(guildOrderId)) {
      case (?guildOrder) {
        let updatedGuildOrder : GuildOrder = {
          id = guildOrder.id;
          title = guildOrder.title;
          description = guildOrder.description;
          reward = guildOrder.reward;
          status = guildOrder.status;
          assignedTo = ?userId;
        };
        guildOrders.add(guildOrderId, updatedGuildOrder);
      };
      case (null) { Runtime.trap("Guild order not found") };
    };
  };

  ////////////////////////////////////////////////////
  // Coupon Management
  ////////////////////////////////////////////////////

  public shared ({ caller }) func createCoupon(code : Text, discount : Nat, valid : Bool) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create coupons");
    };
    let couponId = nextCouponId;
    nextCouponId += 1;
    let coupon : Coupon = {
      id = couponId;
      code;
      discount;
      valid;
    };
    coupons.add(couponId, coupon);
    couponId;
  };

  public shared ({ caller }) func updateCoupon(id : Nat, code : Text, discount : Nat, valid : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update coupons");
    };
    switch (coupons.get(id)) {
      case (?oldCoupon) {
        let updated : Coupon = {
          id;
          code;
          discount;
          valid;
        };
        coupons.add(id, updated);
      };
      case (null) { Runtime.trap("Coupon not found") };
    };
  };

  public query ({ caller }) func getAllCoupons() : async [Coupon] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all coupons");
    };
    coupons.values().toArray();
  };

  // Internal helper function for coupon validation
  private func validateCouponInternal(code : Text) : CouponValidationResult {
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

  // Public coupon validation endpoint (requires user authentication)
  public query ({ caller }) func validateCoupon(code : Text) : async CouponValidationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can validate coupons");
    };
    validateCouponInternal(code);
  };

  ////////////////////////////////////////////////////
  // Cart and Checkout Management
  ////////////////////////////////////////////////////

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access cart");
    };
    switch (userCarts.get(caller)) {
      case (?cartItems) { cartItems };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let cartItem : CartItem = {
      productId;
      quantity;
    };
    let currentCart = switch (userCarts.get(caller)) {
      case (?cartItems) { cartItems };
      case (null) { [] };
    };
    let updatedCart = currentCart.concat([cartItem]);
    userCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    switch (userCarts.get(caller)) {
      case (?cartItems) {
        let updatedCart = cartItems.filter(func(item : CartItem) : Bool {
          item.productId != productId;
        });
        userCarts.add(caller, updatedCart);
      };
      case (null) { /* No items to remove */ };
    };
  };

  public shared ({ caller }) func checkoutCart(couponCode : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };
    let cartItems = switch (userCarts.get(caller)) {
      case (?items) { items };
      case (null) { [] };
    };
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let productIds = cartItems.map(func(item) { item.productId });
    var totalAmount = 0;
    for (item in cartItems.values()) {
      switch (products.get(item.productId)) {
        case (?product) {
          totalAmount += product.price * item.quantity;
        };
        case (null) { Runtime.trap("Product not found") };
      };
    };

    var finalAmount = totalAmount;
    var discountAmount = 0;
    var appliedCode : ?Text = null;

    switch (couponCode) {
      case (?code) {
        let validation = validateCouponInternal(code);
        if (validation.valid) {
          discountAmount := validation.discount;
          if (finalAmount > discountAmount) {
            finalAmount -= discountAmount;
          } else {
            finalAmount := 0;
          };
          appliedCode := ?code;
        };
      };
      case (null) { /* No coupon applied */ };
    };

    let orderId = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id = orderId;
      userId = caller;
      productIds;
      totalAmount = finalAmount;
      appliedCouponCode = appliedCode;
      discountAmount;
    };
    orders.add(orderId, order);

    userCarts.add(caller, []);

    orderId;
  };

  ////////////////////////////////////////////////////
  // Feedback Management (New)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func createFeedback(userId : Principal, message : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only authorized users can create feedback");
    };
    let feedbackId = nextFeedbackId;
    nextFeedbackId += 1;
    let feedback : Feedback = {
      id = feedbackId;
      userId;
      message;
      status = #open;
    };
    feedbackStore.add(feedbackId, feedback);
    feedbackId;
  };

  public shared ({ caller }) func reviewFeedback(feedbackId : Nat, admin : Principal, response : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can review feedback");
    };
    switch (feedbackStore.get(feedbackId)) {
      case (?feedback) {
        if (feedback.status != #open) {
          Runtime.trap("Cannot review feedback that is not open");
        };
        let updatedFeedback : Feedback = {
          feedback with
          status = #reviewed({
            admin;
            response = ?response;
          });
        };
        feedbackStore.add(feedbackId, updatedFeedback);
      };
      case (null) { Runtime.trap("Feedback not found") };
    };
  };

  public shared ({ caller }) func completeFeedback(feedbackId : Nat, admin : Principal, response : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can complete feedback");
    };
    switch (feedbackStore.get(feedbackId)) {
      case (?feedback) {
        if (feedback.status != #reviewed({
          admin;
          response = ?response;
        })) {
          Runtime.trap("Cannot complete feedback that is not reviewed");
        };
        let updatedFeedback : Feedback = {
          feedback with
          status = #completed({
            admin;
            response;
          });
        };
        feedbackStore.add(feedbackId, updatedFeedback);
      };
      case (null) { Runtime.trap("Feedback not found") };
    };
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    feedbackStore.values().toArray();
  };

  ////////////////////////////////////////////////////
  // PORTFOLIO CRUT (No Deletion)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func createPortfolio(
    title : Text,
    description : Text,
    artworks : [Nat],
    category : PortfolioCategory,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create portfolios");
    };
    let portfolioId = nextPortfolioId;
    nextPortfolioId += 1;
    let portfolio : Portfolio = {
      id = portfolioId;
      title;
      description;
      artworks;
      category;
    };
    portfolios.add(portfolioId, portfolio);
    portfolioId;
  };

  public shared ({ caller }) func updatePortfolio(
    id : Nat,
    title : Text,
    description : Text,
    artworks : [Nat],
    category : PortfolioCategory,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update portfolios");
    };
    switch (portfolios.get(id)) {
      case (?oldPortfolio) {
        let updated : Portfolio = {
          id;
          title;
          description;
          artworks;
          category;
        };
        portfolios.add(id, updated);
      };
      case (null) { Runtime.trap("Portfolio not found") };
    };
  };

  ////////////////////////////////////////////////////
  // TESTIMONY CRUT (No Deletion)
  ////////////////////////////////////////////////////

  // Public testimony creation - allows any user including guests to submit testimonies
  // Testimonies are created as unapproved by default and require admin moderation
  public shared ({ caller }) func createTestimony(
    author : Text,
    content : Text,
    rating : ?Nat,
    photo : ?Storage.ExternalBlob,
    video : ?Storage.ExternalBlob,
  ) : async Nat {
    // Validate content length (max 800 characters)
    if (content.size() > 800) {
      Runtime.trap("Review text must be 800 characters or less");
    };
    
    // Validate rating if provided (must be 1-5)
    switch (rating) {
      case (?r) {
        if (r < 1 or r > 5) {
          Runtime.trap("Rating must be between 1 and 5 stars");
        };
      };
      case (null) { /* No rating provided is acceptable */ };
    };

    let testimonyId = nextTestimonyId;
    nextTestimonyId += 1;
    let testimony : Testimony = {
      id = testimonyId;
      author;
      content;
      approved = false; // All customer testimonies start as unapproved
      rating;
      photo;
      video;
    };
    testimonies.add(testimonyId, testimony);
    testimonyId;
  };

  // Admin-only testimony moderation - update testimony approval status and content
  public shared ({ caller }) func updateTestimony(
    id : Nat,
    author : Text,
    content : Text,
    approved : Bool,
    rating : ?Nat,
    photo : ?Storage.ExternalBlob,
    video : ?Storage.ExternalBlob,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update testimonies");
    };
    
    // Validate content length
    if (content.size() > 800) {
      Runtime.trap("Review text must be 800 characters or less");
    };
    
    // Validate rating if provided
    switch (rating) {
      case (?r) {
        if (r < 1 or r > 5) {
          Runtime.trap("Rating must be between 1 and 5 stars");
        };
      };
      case (null) { /* No rating provided is acceptable */ };
    };

    switch (testimonies.get(id)) {
      case (?oldTestimony) {
        let updated : Testimony = {
          id;
          author;
          content;
          approved;
          rating;
          photo;
          video;
        };
        testimonies.add(id, updated);
      };
      case (null) { Runtime.trap("Testimony not found") };
    };
  };

  // Admin-only testimony removal - sets approved to false to hide from public view
  public shared ({ caller }) func removeTestimony(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove testimonies");
    };
    switch (testimonies.get(id)) {
      case (?testimony) {
        let updated : Testimony = {
          testimony with
          approved = false;
        };
        testimonies.add(id, updated);
      };
      case (null) { Runtime.trap("Testimony not found") };
    };
  };

  // Admin-only: Get all testimonies including unapproved ones for moderation
  public query ({ caller }) func getAllTestimonies() : async [Testimony] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all testimonies");
    };
    testimonies.values().toArray();
  };
};
