define(['presenters/resource-manager-presenter', 'errors'], function(ResourceManagerPresenter, errors) {
  function ResourceManager() {
    this.product = 10;
    this.capacity = 100;
    this.bankAccount = 5000;
    this.presenter = new ResourceManagerPresenter(this);
  }

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

  ResourceManager.prototype.sellProduct = function(amount, cash) {
    if (this.productIsAvailable()) {
      this.product -= amount;
      this.bankAccount += cash;
      this.presenter.refresh();
    }
  }

  ResourceManager.prototype.buyProduct = function(amount, price) {
    if (this.cashIsAvailable(price) && this.capacityIsAvailable(amount)) {
      this.product += amount;
      this.bankAccount -= price;
      this.presenter.refresh();
    }
  }

  return ResourceManager;
});
