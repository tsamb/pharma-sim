define(['presenters/storage-manager-presenter'], function(StorageManagerPresenter) {
  var CAPACITY_LEVEL_MULTIPLE = 100;
  var CAPACITY_COST_MULTIPLE = 50;
  var CAPACITY_COST_EXPONENT = 2;

  function StorageManager(args) {
    this.capacity = args.capacity || 0;
    this.presenter = new StorageManagerPresenter(this);
  }

  StorageManager.prototype.increaseCapacity = function(amount) {
    this.capacity += amount;
    this.presenter.refresh();
  }

  StorageManager.prototype.currentCapacityLevel = function() {
    return this.capacity / CAPACITY_LEVEL_MULTIPLE;
  }

  StorageManager.prototype.cashForNextCapacityLevel = function() {
    return Math.pow((this.currentCapacityLevel() * CAPACITY_COST_MULTIPLE), CAPACITY_COST_EXPONENT);
  }

  return StorageManager;
});
