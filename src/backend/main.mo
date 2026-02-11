import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Bool "mo:core/Bool";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  var adminAccessCode : Text = "7583A";

  type AdminAccessLogEntry = {
    id : Nat;
    principal : Principal;
    timestamp : Nat;
    browserInfo : ?Text;
    deviceType : ?Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var adminAttempts = Map.empty<Principal, Nat>();
  let ADMIN_LOCKOUT_THRESHOLD = 3;
  var adminAccessLog = Map.empty<Nat, AdminAccessLogEntry>();
  var nextAdminAccessLogId = 1;
  var nextEventId = 1;
  var nextAuditLogId = 1;
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
  var adminRegistry = Map.empty<Principal, AdminPermissions>();
  var adminCredentials = Map.empty<Principal, AdminCredentials>();
  var inbox = Map.empty<Principal, [InboxItem]>();
  var adminLogins = Map.empty<Nat, AdminLoginAttempt>();
  var auditLog = Map.empty<Nat, AuditLogEntry>();
  var events = Map.empty<Nat, Event>();
  var artifacts = Map.empty<Nat, Artifact>();

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
  var nextLoginId = 1;
  var nextLoginAttemptId = 1;
  var globalInboxId = 1;
  var nextArtifactId = 1;
  var ownerPrincipal : ?Principal = null;
  var storeConfig : StoreConfig = {
    isActive = true;
    enableCoupons = true;
  };

  var searchQueryStats : Map.Map<Text, Nat> = Map.empty<Text, Nat>();

  public type ArtifactCategory = {
    #product;
    #testimony;
    #portfolio;
    #design;
    #service;
    #certificate;
    #caseStudy;
    #tutorial;
  };

  public type Artifact = {
    id : Nat;
    title : Text;
    description : Text;
    searchableText : Text;
    category : ArtifactCategory;
    isVisible : Bool;
    createdBy : Principal;
    media : ?Storage.ExternalBlob;
    externalLink : ?Text;
    publicationDate : Nat;
    createdAt : Nat;
    lastUpdated : Nat;
    location : ?Text;
    platform : ?Text;
    tags : [Text];
    rating : ?Float;
  };

  public type ArtifactSortOption = {
    #relevance;
    #rating;
    #preferenceMatch;
    #recency;
    #hybrid;
    #priority;
    #random;
  };

  public type ArtifactSearchResult = {
    artifact : Artifact;
    matchCount : Nat;
    relevanceScore : Float;
    userPreferenceScore : ?Float;
    overallScore : ?Float;
    searchScore : Float;
    highlightedTitle : Text;
    highlightedDescription : Text;
    source : ArtifactCategory;
    visibility : Nat;
    timestamp : Nat;
    assetStatus : {
      #visibilityPublic;
      #inReview;
      #restricted;
      #pending;
    };
  };

  private func isOwner(caller : Principal) : Bool {
    switch (ownerPrincipal) {
      case (?owner) { caller == owner };
      case (null) { false };
    };
  };

  private func hasAdminPermission(admin : Principal, checkPermission : (AdminPermissions) -> Bool) : Bool {
    switch (adminRegistry.get(admin)) {
      case (?permissions) { permissions.isOwner or permissions.fullPermissions or checkPermission(permissions) };
      case (null) { false };
    };
  };

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

  private func recordAdminAttemptInternal(principal : Principal) {
    let newAttempts = switch (adminAttempts.get(principal)) {
      case (null) { 1 };
      case (?prev) { prev + 1 };
    };

    if (newAttempts >= ADMIN_LOCKOUT_THRESHOLD) {
      adminAttempts.add(principal, 0);
    } else {
      adminAttempts.add(principal, newAttempts);
    };
  };

  public shared ({ caller }) func resetAdminAttempts(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset attempts");
    };
    adminAttempts.add(principal, 0);
  };

  public query ({ caller }) func getAttemptCount(principal : Principal) : async Nat {
    if (caller != principal and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Can only view your own attempt count");
    };
    let attempts = switch (adminAttempts.get(principal)) {
      case (null) { 0 };
      case (?count) { count };
    };
    attempts;
  };

  public query ({ caller }) func getAdminAttempts(principal : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin attempts");
    };
    let attempts = switch (adminAttempts.get(principal)) {
      case (null) { 0 };
      case (?count) { count };
    };
    attempts;
  };

  /// If returns "Invalid Access Code" an error message has to be presented in the app
  /// Only on successful returns, the full admin dashboard should become accessible.
  public shared ({ caller }) func submitAdminAccessAttempt(
    accessCode : Text,
    browserInfo : ?Text,
    deviceType : ?Text,
  ) : async Text {
    let currentAttempts = switch (adminAttempts.get(caller)) {
      case (null) { 0 };
      case (?count) { count };
    };

    if (currentAttempts >= ADMIN_LOCKOUT_THRESHOLD) {
      Runtime.trap("Account locked due to too many failed attempts. Contact administrator.");
    };

    if (accessCode == adminAccessCode) {
      ignore await verifyAdminAccess(accessCode, browserInfo, deviceType);
      "AdminAccessGranted";
    } else {
      recordAdminAttemptInternal(caller);
      "Invalid Access Code";
    };
  };

  public query ({ caller }) func getCurrentAdminAccessCode() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view access codes");
    };
    ?adminAccessCode;
  };

  /// Entry point for admin authentication - allows guest/anonymous access
  public shared ({ caller }) func adminLogin(adminCode : Text, codeConfirmed : Bool, browserInfo : Text, deviceInfo : Text) : async Bool {
    if (not codeConfirmed) {
      return false;
    };
    await verifyAdminAccess(adminCode, ?browserInfo, ?deviceInfo);
  };

  /// Verifies admin access code and grants admin role on success
  /// Allows any caller (including guests) to attempt verification
  public shared ({ caller }) func verifyAdminAccess(adminAttemptedCode : Text, browserInfo : ?Text, deviceType : ?Text) : async Bool {
    let currentAttempts = switch (adminAttempts.get(caller)) {
      case (null) { 0 };
      case (?count) { count };
    };

    if (currentAttempts >= ADMIN_LOCKOUT_THRESHOLD) {
      Runtime.trap("Account locked due to too many failed attempts. Contact administrator.");
    };

    let isValid = adminAttemptedCode == adminAccessCode;
    let currentTimestamp = Int.abs(Time.now());

    let attempt : AdminLoginAttempt = {
      id = nextLoginAttemptId;
      principal = caller;
      timestamp = currentTimestamp;
      successful = isValid;
    };

    adminLogins.add(nextLoginAttemptId, attempt);
    nextLoginAttemptId += 1;

    if (isValid) {
      adminAttempts.add(caller, 0);

      let accessLogEntry : AdminAccessLogEntry = {
        id = nextAdminAccessLogId;
        principal = caller;
        timestamp = currentTimestamp;
        browserInfo;
        deviceType;
      };
      adminAccessLog.add(nextAdminAccessLogId, accessLogEntry);
      nextAdminAccessLogId += 1;
      AccessControl.assignRole(accessControlState, caller, caller, #admin);

      recordAuditLogInternal(
        caller,
        #adminLogin,
        "Admin access granted via master code",
        null
      );

      return true;
    } else {
      recordAdminAttemptInternal(caller);
      return false;
    };
  };

  public query ({ caller }) func verifyAccessCode(adminAttemptedCode : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify access codes");
    };
    adminAttemptedCode == adminAccessCode;
  };

  public shared ({ caller }) func updateAdminAccessCode(newAccessCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update access codes");
    };
    adminAccessCode := newAccessCode;
  };

  public shared ({ caller }) func changeAdminAccessCode(newCodeConfirmed : Text, currentAccessCode : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can change access codes");
    };
    await confirmNewCode(newCodeConfirmed, currentAccessCode);
  };

  public shared ({ caller }) func confirmNewCode(newCode : Text, currentCode : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm new codes");
    };

    let isValid = await verifyAccessCode(currentCode);
    if (not isValid) {
      Runtime.trap("Current access code is invalid");
    };
    adminAccessCode := newCode;

    recordAuditLogInternal(
      caller,
      #adminEdit,
      "Admin access code changed",
      null
    );

    true;
  };

  public query ({ caller }) func getLoginAttempts() : async [AdminLoginAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view login attempts");
    };
    adminLogins.values().toArray();
  };

  public query ({ caller }) func getAdminAccessLog() : async [AdminAccessLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin access log");
    };
    adminAccessLog.values().toArray();
  };

  public type Event = {
    id : Nat;
    message : Text;
    level : Text;
    timestamp : Nat;
    principal : Principal;
  };

  public shared ({ caller }) func logEvent(message : Text, level : Text) : async () {
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

    if (level == "admin" and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can log admin-level events");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log events");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view events");
    };
    events.values().toArray();
  };

  public type AuditActionType = {
    #adminLogin;
    #adminEdit;
    #adminApproval;
    #adminDecline;
    #adminMessage;
    #couponCreate;
    #couponToggle;
    #orderUpdate;
  };

  public type AuditLogEntry = {
    id : Nat;
    actorPrincipal : Principal;
    actionType : AuditActionType;
    timestamp : Nat;
    details : Text;
    target : ?Principal;
  };

  private func recordAuditLogInternal(actorPrincipal : Principal, actionType : AuditActionType, details : Text, target : ?Principal) {
    let timestamp = Int.abs(Time.now());
    let entry : AuditLogEntry = {
      id = nextAuditLogId;
      actorPrincipal;
      actionType;
      timestamp;
      details;
      target;
    };

    auditLog.add(nextAuditLogId, entry);
    nextAuditLogId += 1;
  };

  public query ({ caller }) func getAuditLogEntry(id : Nat) : async ?AuditLogEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    auditLog.get(id);
  };

  public query ({ caller }) func getAuditLogEntriesForActor(actorPrincipal : Principal) : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    auditLog.values().toArray().filter(func(entry) { entry.actorPrincipal == actorPrincipal });
  };

  public query ({ caller }) func getAuditLogEntriesByType(actionType : AuditActionType) : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    auditLog.values().toArray().filter(func(entry) { entry.actionType == actionType });
  };

  public query ({ caller }) func getAllAuditLogEntries() : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };
    auditLog.values().toArray();
  };

  public query ({ caller }) func getRecentAuditLogEntries(count : Nat) : async [AuditLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    let allEntries = auditLog.values().toArray();
    if (allEntries.size() <= count) {
      return allEntries;
    };

    let startIndex = if (allEntries.size() > count) { allEntries.size() - count } else { 0 };
    allEntries.sliceToArray(startIndex, allEntries.size());
  };

  public query ({ caller }) func getAuditLogStats() : async {
    total : Nat;
    loginCounts : Nat;
    editCounts : Nat;
    approvalCounts : Nat;
    declineCounts : Nat;
    messageCounts : Nat;
    couponCreateCounts : Nat;
    couponToggleCounts : Nat;
    orderUpdateCounts : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view audit log stats");
    };

    let values = auditLog.values().toArray();

    let loginCounts = values.filter(func(entry) { entry.actionType == #adminLogin }).size();
    let editCounts = values.filter(func(entry) { entry.actionType == #adminEdit }).size();
    let approvalCounts = values.filter(func(entry) { entry.actionType == #adminApproval }).size();
    let declineCounts = values.filter(func(entry) { entry.actionType == #adminDecline }).size();
    let messageCounts = values.filter(func(entry) { entry.actionType == #adminMessage }).size();
    let couponCreateCounts = values.filter(func(entry) { entry.actionType == #couponCreate }).size();
    let couponToggleCounts = values.filter(func(entry) { entry.actionType == #couponToggle }).size();
    let orderUpdateCounts = values.filter(func(entry) { entry.actionType == #orderUpdate }).size();

    {
      total = values.size();
      loginCounts;
      editCounts;
      approvalCounts;
      declineCounts;
      messageCounts;
      couponCreateCounts;
      couponToggleCounts;
      orderUpdateCounts;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
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

  public type AdminPermissions = {
    principal : Principal;
    canCreateProduct : Bool;
    canEditProduct : Bool;
    canDeleteProduct : Bool;
    canCreateOrder : Bool;
    canManageUsers : Bool;
    canApplyDiscounts : Bool;
    canProcessRefunds : Bool;
    canViewMetrics : Bool;
    canManageInventory : Bool;
    canRemoveUsers : Bool;
    canDeactivateStore : Bool;
    fullPermissions : Bool;
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
    isRead : Bool;
  };

  public type NotificationCounts = {
    newQuotes : Nat;
    newOrders : Nat;
    newTestimonies : Nat;
    newMessagesCount : Nat;
  };

  public query ({ caller }) func getAdminNotifications() : async NotificationCounts {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch notifications");
    };

    countUnreadNotifications();
  };

  private func countUnreadNotifications() : NotificationCounts {
    let numNewQuotes = quoteRequests.values().toArray().filter(
      func(_quote) {
        true;
      }
    );

    let newOrders = orders.values().toArray().filter(
      func(_order) {
        true;
      }
    );

    let unpublishedTestimonies = testimonies.values().toArray().filter(
      func(testimony) {
        not testimony.approved;
      }
    );

    let unreadMessages = List.fromArray<InboxItem>([]);

    for (inboxArray in inbox.values()) {
      let unreadForCustomer = List.fromArray<InboxItem>(
        inboxArray.filter(func(item) { not item.isRead })
      );
      unreadMessages.addAll(unreadForCustomer.values());
    };

    {
      newQuotes = numNewQuotes.size();
      newOrders = newOrders.size();
      newTestimonies = unpublishedTestimonies.size();
      newMessagesCount = unreadMessages.size();
    };
  };

  public query ({ caller }) func getPermissions(principal : Principal) : async ?AdminPermissions {
    if (caller != principal and not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the admin themselves or another admin can view permissions");
    };
    adminRegistry.get(principal);
  };

  public query ({ caller }) func listAdmins() : async [AdminPermissions] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list admins");
    };
    adminRegistry.values().toArray();
  };

  public query ({ caller }) func getAllAdmins() : async [AdminPermissions] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all admins");
    };
    adminRegistry.values().toArray();
  };

  public shared ({ caller }) func setOwner(owner : Principal) : async () {
    if (ownerPrincipal != null) {
      Runtime.trap("Owner already set. Cannot modify owner.");
    };
    ownerPrincipal := ?owner;
    AccessControl.assignRole(accessControlState, caller, owner, #admin);

    let ownerPermissions : AdminPermissions = {
      principal = owner;
      canCreateProduct = true;
      canEditProduct = true;
      canDeleteProduct = true;
      canCreateOrder = true;
      canManageUsers = true;
      canApplyDiscounts = true;
      canProcessRefunds = true;
      canViewMetrics = true;
      canManageInventory = true;
      canRemoveUsers = true;
      canDeactivateStore = true;
      fullPermissions = true;
      isOwner = true;
    };
    adminRegistry.add(owner, ownerPermissions);
  };

  public query ({ caller }) func getTestimony(id : Nat) : async ?Testimony {
    testimonies.get(id);
  };

  public query ({ caller }) func getOnlyVerifiedTestimonies() : async [Testimony] {
    testimonies.toArray().filter(func((_, t)) { t.approved }).map(func((_, t)) { t });
  };

  public query ({ caller }) func getAllTestimonies() : async [Testimony] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all testimonies including unverified ones");
    };
    testimonies.toArray().map(func((_, t)) { t });
  };

  public type AdminLoginAttempt = {
    id : Nat;
    principal : Principal;
    timestamp : Nat;
    successful : Bool;
  };
};
