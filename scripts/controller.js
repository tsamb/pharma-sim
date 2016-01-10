define(['models/resource-manager', 'models/house','models/supply-offer', 'models/days'], function(ResourceManager, House, SupplyOffer, Days) {
  var Controller = function() {
    this.days = new Days;
    this.resourceManager = new ResourceManager;
    this.houses = [];
    this.supplyOffers = [];
    this.coreLoop = window.setInterval(this.coreCycle.bind(this), 500);
    this.init();
  }

  Controller.prototype.init = function() {
    this.addHouse({budget: 200, frequency: 5});
    this.addHouse({budget: 300, frequency: 20});
    this.addHouse({budget: 500, frequency: 30});
    this.addSupplyOffer({amount: 10, price: 2500});
    this.addSupplyOffer({amount: 100, price: 20000});
    this.addSupplyOffer({amount: 500, price: 75000});
    this.addSupplyOffer({amount: 1000, price: 120000});
  }

  Controller.prototype.coreCycle = function() {
    this.days.increment();
    this.updateReadinessOfAllHouses(this.days.count);
    // move/call the above method to/on the soon to be formed Neighborhood class
  }

  // move the below method into a Neighborhood class which manages House objects
  Controller.prototype.updateReadinessOfAllHouses = function(day) {
    this.houses.forEach(function(house) {
      house.updateReadiness(day);
    });
  }

  Controller.prototype.sellToHouse = function(houseId) {
    var house = this.houses.find(function(house) { return house.id === houseId });
    if (house && house.ready() && this.resourceManager.productIsAvailable()) {
      this.resourceManager.sellProduct(1, house.sell());
    }
  }

  Controller.prototype.buyProduct = function(offerId) {
    var offer = this.supplyOffers.find(function(offer) { return offer.id === offerId });
    if (offer) {
      this.resourceManager.buyProduct(offer.amount, offer.price);
    }
  }

  Controller.prototype.addHouse = function(args) {
    var house = new House(args);
    document.querySelector("#" + house.id + " button").addEventListener('click', function() {
      this.sellToHouse(house.id);
    }.bind(this));
    this.houses.push(house);
    return this.houses;
  }

  Controller.prototype.addSupplyOffer = function(args) {
    var offer = new SupplyOffer(args);
    document.getElementById(offer.id).addEventListener('click', function() {
      this.buyProduct(offer.id);
    }.bind(this));
    this.supplyOffers.push(offer);
    return this.supplyOffers;
  }

  return Controller;
})
