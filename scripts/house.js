define(['./house-presenter', './errors'], function(HousePresenter, errors) {
    function House(args) {
    House.numInstances = (House.numInstances || 0) + 1;
    this.budget = args.budget;
    this.frequency = args.frequency;
    this.willingToBuy = true;
    this.id = this.constructor.name.toLowerCase() + "-" + House.numInstances;
    this.presenter = new HousePresenter(this);
  }

  House.prototype.sell = function() {
    if (this.willingToBuy) {
      this.willingToBuy = false;
      this.presenter.refresh();
      return this.budget;
    } else {
      return 0;
    }
  }

  House.prototype.checkReadiness = function(day) {
    if (day % this.frequency === 0) {
      this.willingToBuy = true;
      this.presenter.refresh();
    }
  }

  House.prototype.ready = function() {
    if (this.willingToBuy) {
      return true;
    } else {
      errors.add("house is not ready to make a purchase");
    }
  }

  House.prototype.readyText = function() {
    if (this.willingToBuy) {
      return "$$$ Ready to buy $$$";
    } else {
      return "Not ready";
    }
  }

  return House;
})
