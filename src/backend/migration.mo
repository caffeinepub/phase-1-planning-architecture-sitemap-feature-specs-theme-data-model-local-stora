import Map "mo:core/Map";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";

module {
  type OldTestimony = {
    id : Nat;
    author : Text;
    content : Text;
    approved : Bool;
    rating : ?Nat;
    photo : ?Storage.ExternalBlob;
    video : ?Storage.ExternalBlob;
  };

  type OldActor = {
    nextTestimonyId : Nat;
    testimonies : Map.Map<Nat, OldTestimony>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
