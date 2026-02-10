import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
  };

  type OldTestimony = {
    id : Nat;
    author : Text;
    content : Text;
    approved : Bool;
    rating : ?Nat;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
    testimonies : Map.Map<Nat, OldTestimony>;
  };

  type NewProduct = {
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

  type NewTestimony = {
    id : Nat;
    author : Text;
    content : Text;
    approved : Bool;
    rating : ?Nat;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    testimonies : Map.Map<Nat, NewTestimony>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          image = "/null";
          isInStock = oldProduct.stock > 0;
          availability = #delivery;
          shortDescription = "No short description";
        };
      }
    );

    let newTestimonies = old.testimonies.map<Nat, OldTestimony, NewTestimony>(
      func(_id, oldTestimony) {
        { oldTestimony with photo = null; video = null };
      }
    );

    { products = newProducts; testimonies = newTestimonies };
  };
};
