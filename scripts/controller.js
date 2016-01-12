define(['models/resource-manager',
'models/house',
'models/supply-offer',
'models/days',
'models/neighborhood'],
function(ResourceManager, House, SupplyOffer, Days, Neighborhood) {
  var Controller = function() {
    this.days = new Days;
    this.resourceManager = new ResourceManager;
    this.neighborhood = new Neighborhood;
    this.supplyOffers = [];
    this.coreLoop = window.setInterval(this.coreCycle.bind(this), 500);
    this.init();
  }

  Controller.prototype.init = function() {
    this.addHouse({budget: 80, frequency: 5});
    this.addHouse({budget: 120, frequency: 20});
    this.addHouse({budget: 250, frequency: 30});
    this.addSupplyOffer({amount: 10, price: 1000});
    this.addSupplyOffer({amount: 100, price: 7500});
    this.addSupplyOffer({amount: 500, price: 30000});
    this.addSupplyOffer({amount: 1000, price: 50000});
  }

  Controller.prototype.coreCycle = function() {
    this.days.increment();
    this.neighborhood.updateHouseReadiness(this.days.count);
  }

  Controller.prototype.sellToHouse = function(houseId) {
    var house = this.neighborhood.findHouse(houseId);
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
    var houseId = this.neighborhood.addHouse(args);
    document.querySelector("#" + houseId + " button").addEventListener('click', function() {
      this.sellToHouse(houseId);
    }.bind(this));
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
