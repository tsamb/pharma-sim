define(['presenters/supply-offer-presenter'], function(SupplyOfferPresenter) {
  function SupplyOffer(args) {
    SupplyOffer.numInstances = (SupplyOffer.numInstances || 0) + 1;
    this.amount = args.amount;
    this.price = args.price;
    this.id = this.constructor.name.toLowerCase() + "-" + SupplyOffer.numInstances;
    this.presenter = new SupplyOfferPresenter(this);
  }

  return SupplyOffer;
});
