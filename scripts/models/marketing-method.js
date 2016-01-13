define(['presenters/marketing-method-presenter'], function(MarketingMethodPresenter) {
  function MarketingMethod(args) {
    MarketingMethod.numInstances = (MarketingMethod.numInstances || 0) + 1;
    this.name = args.name;
    this.hype = args.hype;
    this.price = args.price;
    this.id = this.constructor.name.toLowerCase() + "-" + MarketingMethod.numInstances;
    this.presenter = new MarketingMethodPresenter(this);
  }

  return MarketingMethod;
})
