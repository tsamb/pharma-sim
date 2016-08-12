define(['presenters/house-presenter', 'models/marketing-manager','errors/errors'], function(HousePresenter, MarketingManager, errors) {
  function House(args) {
    House.numInstances = (House.numInstances || 0) + 1;
    this.budget = args.budget;
    this.frequency = args.frequency;
    this.willingToBuy = false;
    this.active = args.active || false;
    this.hypeToActivate = args.hypeToActivate || 0;
    this.id = this.constructor.name.toLowerCase() + "-" + House.numInstances;
    this.resourceManager = args.resourceManager;
    this.marketingManager = MarketingManager;
    this.presenter = new HousePresenter(this);
  }

  // <<<<<<<< COMPUTED PROPERTIES >>>>>>>>

  House.prototype.currentBudget = function() {
    return Math.floor(this.budget * Math.log10(9 + this.marketingManager.level()));
  }

  House.prototype.currentFrequency = function() {
    return Math.ceil(this.frequency / Math.log10(9 + this.marketingManager.level()));
  }

  House.prototype.readyText = function() {
    if (this.willingToBuy && this.active) {
      return "$ Ready $";
    } else {
      return "Not ready";
    }
  }

  // <<<<<<<< IMMUTABLE BOOLEAN CHECKS >>>>>>>>

  House.prototype.ready = function() {
    if (this.active) {
      if (this.willingToBuy) {
        return true;
      } else {
        errors.add("house is not ready to make a purchase");
        return false;
      }
    } else {
      errors.add("house is unavailable for business. try marketing");
      return false;
    }
  }

  // <<<<<<<< IMMUTABLE CALCULATIONS >>>>>>>>

  House.prototype.daysUntilReady = function(day) {
    var freq = this.currentFrequency();
    var cycleDay = day % freq;
    if (cycleDay === 0) {
      return 0;
    } else {
      return freq - cycleDay;
    }
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  House.prototype.sell = function() {
    if (this.ready() && this.resourceManager.productIsAvailable()) {
      this.resourceManager.sellProduct(1, this.currentBudget())
      this.willingToBuy = false;
      this.presenter.refresh();
      return true;
    } else {
      return false;
    }
  }

  House.prototype.updateHype = function() {
    if (!this.active && this.marketingManager.level() >= this.hypeToActivate) {
      this.active = true;
    }
    this.presenter.refresh();
  }

  House.prototype.updateReadiness = function(today) {
    if (this.daysUntilReady(today) === 0) {
      this.willingToBuy = true;
      this.presenter.refresh();
    }
  }

  return House;
})
