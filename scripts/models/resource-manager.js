define(['models/experience-manager',
'presenters/resource-manager-presenter',
'errors'], function(ExperienceManager, ResourceManagerPresenter, errors) {
  function ResourceManager() {
    this.product = 0;
    this.capacity = 100;
    this.bankAccount = 5000;
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
    if (this.product + productAmount <= this.capacity) {
      return true;
    } else {
      errors.add("insufficient space in the store house");
      return false;
    }
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  ResourceManager.prototype.sellProduct = function(amount, cash) {
    if (this.productIsAvailable()) {
      this.product -= amount;
      this.bankAccount += cash;
      this.presenter.refresh();
      new Audio('audio/cash-register.wav').play();
    }
  }

  ResourceManager.prototype.buyProduct = function(amount, price) {
    if (this.cashIsAvailable(price) && this.capacityIsAvailable(amount)) {
      this.product += amount;
      this.bankAccount -= price;
      this.presenter.refresh();
      new Audio('audio/cocking-gun.wav').play();
    }
  }

  return ResourceManager;
});
