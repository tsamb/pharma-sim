define(['presenters/headquarters-presenter'], function(HeadquartersPresenter) {
  var CAPACITY_LEVEL_MULTIPLE = 100;
  var CAPACITY_COST_MULTIPLE = 50;
  var CAPACITY_COST_EXPONENT = 2;

  function Headquarters(args) {
    this.capacity = args.capacity || 0;
    this.presenter = new HeadquartersPresenter(this);
  }

  Headquarters.prototype.increaseCapacity = function(amount) {
    this.capacity += amount;
    this.presenter.refresh();
  }

  Headquarters.prototype.currentCapacityLevel = function() {
    return this.capacity / CAPACITY_LEVEL_MULTIPLE;
  }

  Headquarters.prototype.cashForNextCapacityLevel = function() {
    return Math.pow((this.currentCapacityLevel() * CAPACITY_COST_MULTIPLE), CAPACITY_COST_EXPONENT);
  }

  return Headquarters;
});
