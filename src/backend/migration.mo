import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old actor representing only fields present in the original version
  type OldActor = {
    users : Map.Map<Nat, { id : Nat; name : Text; email : Text }>;
    products : Map.Map<Nat, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text }>;
    orders : Map.Map<Nat, { id : Nat; userId : Principal; productIds : [Nat]; totalAmount : Nat; appliedCouponCode : ?Text; discountAmount : Nat }>;
    guildOrders : Map.Map<Nat, { id : Nat; title : Text; description : Text; reward : Nat; status : Text; assignedTo : ?Principal }>;
    savedArtifacts : Map.Map<Principal, [{ userId : Principal; productId : Nat }]>;
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
    userCarts : Map.Map<Principal, [{ productId : Nat; quantity : Nat }]>;
    feedbackStore : Map.Map<Nat, { id : Nat; userId : Principal; message : Text; status : { #open; #reviewed : { admin : Principal; response : ?Text }; #completed : { admin : Principal; response : Text } } }>;
    portfolios : Map.Map<Nat, { id : Nat; title : Text; description : Text; artworks : [Nat]; category : { #painting; #digitalArt; #sculpture; #photography; #illustration; #typography; #other : Text } }>;
    testimonies : Map.Map<Nat, { id : Nat; author : Text; content : Text; approved : Bool; rating : ?Nat; photo : ?Storage.ExternalBlob; video : ?Storage.ExternalBlob }>;
    coupons : Map.Map<Nat, { id : Nat; code : Text; discount : Nat; valid : Bool }>;
    quoteRequests : Map.Map<Nat, { id : Nat; name : Text; projectDetails : Text; response : ?Text }>;
    expandedProducts : Map.Map<Nat, { id : Nat; productType : Text; sharable : Bool; viewCount : Nat }>;
    nextUserId : Nat;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextGuildOrderId : Nat;
    nextFeedbackId : Nat;
    nextPortfolioId : Nat;
    nextTestimonyId : Nat;
    nextCouponId : Nat;
    nextQuoteRequestId : Nat;
    nextExpandedProductId : Nat;
  };

  func addDefaultProductFields(products : Map.Map<Nat, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text }>) : Map.Map<Nat, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text; visibility : { #visible; #hidden; #outOfStock }; priceOverride : ?Nat }> {
    products.map<Nat, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text }, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text; visibility : { #visible; #hidden; #outOfStock }; priceOverride : ?Nat }>(
      func(_id, product) {
        {
          product with
          visibility = #visible;
          priceOverride = null;
        };
      }
    );
  };

  // New state representing all persistent variables in the upgradece code
  type NewActor = {
    users : Map.Map<Nat, { id : Nat; name : Text; email : Text }>;
    products : Map.Map<Nat, { id : Nat; name : Text; description : Text; price : Nat; stock : Nat; image : Storage.ExternalBlob; isInStock : Bool; availability : { #delivery; #pickup; #dropOff }; shortDescription : Text; visibility : { #visible; #hidden; #outOfStock }; priceOverride : ?Nat }>;
    orders : Map.Map<Nat, { id : Nat; userId : Principal; productIds : [Nat]; totalAmount : Nat; appliedCouponCode : ?Text; discountAmount : Nat }>;
    guildOrders : Map.Map<Nat, { id : Nat; title : Text; description : Text; reward : Nat; status : Text; assignedTo : ?Principal }>;
    savedArtifacts : Map.Map<Principal, [{ userId : Principal; productId : Nat }]>;
    userProfiles : Map.Map<Principal, { name : Text; email : Text }>;
    userCarts : Map.Map<Principal, [{ productId : Nat; quantity : Nat }]>;
    feedbackStore : Map.Map<Nat, { id : Nat; userId : Principal; message : Text; status : { #open; #reviewed : { admin : Principal; response : ?Text }; #completed : { admin : Principal; response : Text } } }>;
    portfolios : Map.Map<Nat, { id : Nat; title : Text; description : Text; artworks : [Nat]; category : { #painting; #digitalArt; #sculpture; #photography; #illustration; #typography; #other : Text } }>;
    testimonies : Map.Map<Nat, { id : Nat; author : Text; content : Text; approved : Bool; rating : ?Nat; photo : ?Storage.ExternalBlob; video : ?Storage.ExternalBlob }>;
    coupons : Map.Map<Nat, { id : Nat; code : Text; discount : Nat; valid : Bool }>;
    quoteRequests : Map.Map<Nat, { id : Nat; name : Text; projectDetails : Text; response : ?Text }>;
    expandedProducts : Map.Map<Nat, { id : Nat; productType : Text; sharable : Bool; viewCount : Nat }>;
    adminRegistry : Map.Map<Principal, { principal : Principal; isOwner : Bool }>;
    adminCredentials : Map.Map<Principal, { principal : Principal; passwordHash : Text }>;
    nextUserId : Nat;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextGuildOrderId : Nat;
    nextFeedbackId : Nat;
    nextPortfolioId : Nat;
    nextTestimonyId : Nat;
    nextCouponId : Nat;
    nextQuoteRequestId : Nat;
    nextExpandedProductId : Nat;
    ownerPrincipal : ?Principal;
    storeConfig : { isActive : Bool; enableCoupons : Bool };
  };

  // Migration function transforms old state to new state
  public func run(old : OldActor) : NewActor {
    {
      old with
      products = addDefaultProductFields(old.products);
      adminRegistry = Map.empty<Principal, { principal : Principal; isOwner : Bool }>();
      adminCredentials = Map.empty<Principal, { principal : Principal; passwordHash : Text }>();
      ownerPrincipal = null;
      storeConfig = { isActive = true; enableCoupons = true };
    };
  };
};
