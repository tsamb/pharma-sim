define(['models/experience-manager',
'models/headquarters',
'presenters/resource-manager-presenter',
'errors'], function(ExperienceManager, Headquarters, ResourceManagerPresenter, errors) {
  var BUY_XP_MULTIPLE = 50;

  function ResourceManager() {
    this.product = 0;
    this.bankAccount = 5000;
    this.headquarters = new Headquarters({capacity: 100});
    this.experienceManager = new ExperienceManager;
    this.presenter = new ResourceManagerPresenter(this);
  }

  // <<<<<<<< IMMUTABLE BOOLEAN CHECKS >>>>>>>>

  ResourceManager.prototype.productIsAvailable = function() {
    if (this.product > 0) {
      return true;
    } else {
      errors.add("insufficient product available");
      return false;
    }
  }

  ResourceManager.prototype.cashIsAvailable = function(amountNeeded) {
    if (this.bankAccount >= amountNeeded) {
      return true;
    } else {
      errors.add("insufficient cash available");
      return false;
    }
  }

  ResourceManager.prototype.capacityIsAvailable = function(productAmount) {
    if (this.product + productAmount <= this.headquarters.capacity) {
      return true;
    } else {
      errors.add("insufficient space in the store house");
      return false;
    }
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  ResourceManager.prototype.sellProduct = function(amount, cash) {
    if (this.productIsAvailable()) {
      this.experienceManager.increase(amount * cash)
      this.product -= amount;
      this.bankAccount += cash;
      this.presenter.refresh();
      new Audio('audio/cash-register.wav').play();
    }
  }

  ResourceManager.prototype.buyProduct = function(amount, price) {
    if (this.cashIsAvailable(price) && this.capacityIsAvailable(amount)) {
      this.experienceManager.increase(amount * BUY_XP_MULTIPLE);
      this.product += amount;
      this.bankAccount -= price;
      this.presenter.refresh();
      new Audio('audio/cocking-gun.wav').play();
    }
  }

  ResourceManager.prototype.increaseCapacity = function() {
    // refactor this method into a headquarters class
    var currentCapacityLevel = this.headquarters.capacity / 100;
    var cashForNextCapacityLevel = Math.pow((currentCapacityLevel * 50), 2);
    if (this.experienceManager.level() > currentCapacityLevel) {
      if (this.cashIsAvailable(cashForNextCapacityLevel)) {
        this.headquarters.increaseCapacity(100);
        this.bankAccount -= cashForNextCapacityLevel;
        this.presenter.refresh();
      }
    } else {
      errors.add("you cannot buy more capacity until level " + (this.experienceManager.level() + 1));
    }
  }

  return ResourceManager;
});
