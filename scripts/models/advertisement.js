define(['presenters/marketing-method-presenter'], function(AdvertisementPresenter) {
  function Advertisement(args) {
    Advertisement.numInstances = (Advertisement.numInstances || 0) + 1;
    this.name = args.name;
    this.hype = args.hype;
    this.price = args.price;
    this.id = this.constructor.name.toLowerCase() + "-" + Advertisement.numInstances;
    this.presenter = new AdvertisementPresenter(this);
  }

  return Advertisement;
})
