import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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

  // Persistent Storage Structures
  let users = Map.empty<Nat, User>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let savedArtifacts = Map.empty<Principal, [SavedArtifact]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // IDs counters
  var nextUserId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;

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
      name = name;
      description = description;
      price = price;
      stock = stock;
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
      productIds = productIds;
      totalAmount = totalAmount;
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
      productId = productId;
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
};
