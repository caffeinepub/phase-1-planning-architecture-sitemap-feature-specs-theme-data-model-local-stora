import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


// Apply migration function on upgrades

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  ////////////////////////////////////////////////////
  // PHASE 1: Feature Specification
  //
  // This section details all planned features per page,
  // clearly marking Phase 1 (spec only) vs. later implementation.
  ////////////////////////////////////////////////////

  public type Feature = {
    description : Text;
    phase : {
      #phase1; // Skeleton/Specification Only
      #later; // Implement in future phases
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
  // PHASE 1: Data Architecture
  //
  // This section defines core entities, relationships,
  // identifiers, and persistent data models.
  ////////////////////////////////////////////////////

  // Entity Definitions
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
  };

  public type Order = {
    id : Nat;
    userId : Principal;
    productIds : [Nat];
    totalAmount : Nat;
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

  // Persistent Storage Structures
  var users = Map.empty<Nat, User>();
  var products = Map.empty<Nat, Product>();
  var orders = Map.empty<Nat, Order>();
  var guildOrders = Map.empty<Nat, GuildOrder>();
  var savedArtifacts = Map.empty<Principal, [SavedArtifact]>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var userCarts = Map.empty<Principal, [CartItem]>();

  // IDs counters
  var nextUserId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextGuildOrderId = 1;

  ////////////////////////////////////////////////////
  // User Role Management (Moved from frontend)
  ////////////////////////////////////////////////////

  public shared ({ caller }) func assignAdminRole(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign admin role");
    };
    AccessControl.assignRole(
      accessControlState,
      caller,
      user,
      #admin,
    );
  };

  public shared ({ caller }) func removeAdminRole(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove admin role");
    };
    AccessControl.assignRole(
      accessControlState,
      caller,
      user,
      #user,
    );
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access user records");
    };
    switch (users.get(id)) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func createUser(name : Text, email : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    // Anyone can view products (including guests)
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func getAllProducts() : async [Product] {
    // Anyone can view products (including guests)
    products.values().toArray();
  };

  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, stock : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    };
    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProductStock(productId : Nat, newStock : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func editProduct(productId : Nat, name : Text, description : Text, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
        };
        products.add(productId, updatedProduct);
      };
      case (null) { Runtime.trap("Product not found") };
    };
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
        // Users can only view their own orders, admins can view all
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func createOrder(productIds : [Nat], totalAmount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let orderId = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id = orderId;
      userId = caller;
      productIds;
      totalAmount;
    };
    orders.add(orderId, order);
    orderId;
  };

  ////////////////////////////////////////////////////
  // Saved Artifacts Management
  ////////////////////////////////////////////////////

  public query ({ caller }) func getSavedArtifacts(userId : Principal) : async [SavedArtifact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saved artifacts");
    };
    // Users can only view their own saved artifacts, admins can view all
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  public shared ({ caller }) func checkoutCart() : async Nat {
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

    let orderId = nextOrderId;
    nextOrderId += 1;
    let order : Order = {
      id = orderId;
      userId = caller;
      productIds;
      totalAmount;
    };
    orders.add(orderId, order);

    userCarts.add(caller, []);

    orderId;
  };
};
