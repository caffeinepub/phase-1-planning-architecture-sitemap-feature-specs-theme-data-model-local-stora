import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Auto-migrate on upgrade!
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
  var inbox = Map.empty<Principal, [InboxItem]>();
  var adminLogins = Map.empty<Nat, AdminLoginAttempt>();

  // Persistent ID counters
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
  var nextInboxItemId = 1;
  var nextLoginId = 1; // Counter for login attempts

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

  // Secure Admin Login Tracking
  public type AdminLoginAttempt = {
    id : Nat;
    principal : Principal;
    timestamp : Nat;
    successful : Bool;
  };

  var nextLoginAttemptId = 1;

  // --- Admin Access Log Entry ---
  public type AdminAccessLogEntry = {
    id : Nat;
    principal : Principal;
    timestamp : Nat;
  };

  var nextAdminAccessLogId = 1;
  var adminAccessLog = Map.empty<Nat, AdminAccessLogEntry>();

  // PIN Verification and Audit Logging
  public shared ({ caller }) func verifyAdminAccess(inputCode : Text) : async Bool {
    let masterCode = "7583A";
    let isValid = inputCode == masterCode;
    let currentTimestamp = Int.abs(Time.now());

    // Log the attempt regardless of outcome
    let attempt : AdminLoginAttempt = {
      id = nextLoginAttemptId;
      principal = caller;
      timestamp = currentTimestamp;
      successful = isValid;
    };

    adminLogins.add(nextLoginAttemptId, attempt);
    nextLoginAttemptId += 1;

    if (isValid) {
      // Log successful access attempt
      let accessLogEntry : AdminAccessLogEntry = {
        id = nextAdminAccessLogId;
        principal = caller;
        timestamp = currentTimestamp;
      };
      adminAccessLog.add(nextAdminAccessLogId, accessLogEntry);
      nextAdminAccessLogId += 1;

      // Grant admin role to the caller
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      return true;
    };
    return false;
  };

  public query ({ caller }) func getLoginAttempts() : async [AdminLoginAttempt] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view login attempts");
    };
    adminLogins.values().toArray();
  };

  // Admin-only endpoint to query successful admin access attempts
  public query ({ caller }) func getAdminAccessLog() : async [AdminAccessLogEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view admin access log");
    };
    adminAccessLog.values().toArray();
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
    // Validate level
    let validLevels = ["info", "warning", "error", "admin"];
    var isValidLevel = false;
    for (lvl in validLevels.vals()) {
      if (lvl == level) {
        isValidLevel := true;
      };
    };
    if (not isValidLevel) {
      Runtime.trap("Invalid event level: " # level);
    };

    // Admin-level events require admin permission
    if (level == "admin" and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can log admin-level events");
    };

    let event : Event = {
      id = nextEventId;
      message;
      level;
      timestamp = Int.abs(Time.now());
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
  // User Profile Management (Required by Frontend)
  ////////////////////////////////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Users can only view their own profile, admins can view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
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
    shortReview : ?Text;
    starRating : ?Float;
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

  public type InboxItem = {
    id : Nat;
    customerId : Principal;
    messageType : Text;
    content : Text;
  };

  ////////////////////////////////////////////////////
  // Role Management (Admin-only)
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
};
