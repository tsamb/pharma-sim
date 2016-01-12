define(['presenters/headquarters-presenter'], function(HeadquartersPresenter) {
  function Headquarters(args) {
    this.capacity = args.capacity || 0;
    this.presenter = new HeadquartersPresenter(this);
  }

  Headquarters.prototype.increaseCapacity = function(amount) {
    this.capacity += amount;
  }

  return Headquarters;
});
