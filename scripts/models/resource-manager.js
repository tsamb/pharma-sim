define(['models/experience-manager',
'models/storage-manager',
'presenters/resource-manager-presenter',
'errors/errors'], function(ExperienceManager, StorageManager, ResourceManagerPresenter, errors) {
  var PURCHASE_XP_REWARD_MULTIPLE = 50;

  function ResourceManager() {
    this.product = 0;
    this.bankAccount = 5000;
    this.storageManager = new StorageManager({capacity: 100});
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
    if (this.product + productAmount <= this.storageManager.capacity) {
      return true;
    } else {
      errors.add("insufficient space in the store house");
      return false;
    }
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  ResourceManager.prototype.processPurchase = function(amount) {
    if (amount <= this.bankAccount) {
      this.bankAccount -= amount;
      this.presenter.refresh();
      return true;
    } else {
      return false;
    }
  }

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
      this.experienceManager.increase(amount * PURCHASE_XP_REWARD_MULTIPLE);
      this.product += amount;
      this.bankAccount -= price;
      this.presenter.refresh();
      new Audio('audio/cocking-gun.wav').play();
    }
  }

  ResourceManager.prototype.increaseCapacity = function() {
    if (this.experienceManager.level() > this.storageManager.currentCapacityLevel()) {
      if (this.cashIsAvailable(this.storageManager.cashForNextCapacityLevel())) {
        this.bankAccount -= this.storageManager.cashForNextCapacityLevel();
        this.storageManager.increaseCapacity(100);
        this.presenter.refresh();
      }
    } else {
      errors.add("you cannot buy more capacity until level " + (this.experienceManager.level() + 1));
    }
  }

  return ResourceManager;
});
