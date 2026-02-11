module {
  type OldActor = {
    // All actor state without adminAccessCode
  };

  type NewActor = {
    adminAccessCode : Text;
    // All other actor state
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      adminAccessCode = "7583A";
    };
  };
};
