define(['models/resource-manager',
'models/house',
'models/supply-offer',
'models/days',
'models/neighborhood',
'models/marketing-manager',
'models/advertisement',
'helpers/event-helper'],
function(ResourceManager, House, SupplyOffer, Days, Neighborhood, MarketingManager, Advertisement, EventHelper) {
  var Controller = function() {
    this.days = new Days;
    this.resourceManager = new ResourceManager;
    this.neighborhood = new Neighborhood;
    this.marketingManager = MarketingManager;
    this.supplyOffers = [];
    this.advertisements = [];
  }

  // <<<<<<<< INITIAL SET UP >>>>>>>>

  Controller.prototype.init = function() {
    this.addHouse({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
    this.addHouse({budget: 120, frequency: 20, active: true, hypeToActivate: 0});
    this.addHouse({budget: 150, frequency: 23, active: true, hypeToActivate: 0});
    this.addHouse({budget: 250, frequency: 30, active: true, hypeToActivate: 0});
    this.addHouse({budget: 150, frequency: 25, active: false, hypeToActivate: 2});
    this.addHouse({budget: 180, frequency: 27, active: false, hypeToActivate: 2});
    this.addHouse({budget: 200, frequency: 18, active: false, hypeToActivate: 3});
    this.addHouse({budget: 300, frequency: 60, active: false, hypeToActivate: 4});
    this.addHouse({budget: 140, frequency: 16, active: false, hypeToActivate: 4});
    this.addHouse({budget: 100, frequency: 5, active: false, hypeToActivate: 4});
    this.addHouse({budget: 140, frequency: 22, active: false, hypeToActivate: 5});
    this.addHouse({budget: 120, frequency: 15, active: false, hypeToActivate: 5});
    this.addHouse({budget: 180, frequency: 12, active: false, hypeToActivate: 6});
    this.addHouse({budget: 320, frequency: 40, active: false, hypeToActivate: 6});
    this.addHouse({budget: 240, frequency: 10, active: false, hypeToActivate: 7});

    this.addSupplyOffer({amount: 10, price: 1000});
    this.addSupplyOffer({amount: 100, price: 7500});
    this.addSupplyOffer({amount: 500, price: 30000});
    this.addSupplyOffer({amount: 1000, price: 50000});

    this.addAdvertisement({name: "Paper Boy", price: 500, hype: 1500});
    this.addAdvertisement({name: "Flyer Drop", price: 2000, hype: 8000});
    this.addAdvertisement({name: "Flyer Handout", price: 4000, hype: 20000});
    this.addAdvertisement({name: "Referral Program", price: 10000, hype: 60000});
    this.addAdvertisement({name: "Social Media", price: 30000, hype: 210000});
    this.addAdvertisement({name: "Web Banner Ads", price: 50000, hype: 400000});
    this.addAdvertisement({name: "Billboard", price: 100000, hype: 1000000});
    this.addAdvertisement({name: "TV Spot", price: 500000, hype: 6000000});
    this.addAdvertisement({name: "Superbowl Ad", price: 3000000, hype: 45000000});

    this.addPropertyUpgrade();

    this.addPurchasableSwitches();
  }

  Controller.prototype.start = function() {
    this.coreLoop = setInterval(this.coreCycle.bind(this), 500);
  }

  // <<<<<<<< CORE LOOP >>>>>>>>

  Controller.prototype.coreCycle = function() {
    this.days.increment();
    this.neighborhood.updateHouseReadiness(this.days.count);
    this.marketingManager.organicHypeFade();
    this.neighborhood.updateHype();
  }

  // <<<<<<<< CONTROLLER METHODS >>>>>>>>

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

  Controller.prototype.purchaseAdvertising = function(methodId) {
    var method = this.advertisements.find(function(method) { return method.id === methodId });
    if (method && this.resourceManager.cashIsAvailable(method.price)) {
      this.resourceManager.processPurchase(method.price);
      this.marketingManager.increaseHype(method.hype);
    }
  }

  // <<<<<<<< MODEL INSTANTIATORS / EVENT BINDINGS >>>>>>>>

  Controller.prototype.addHouse = function(args) {
    var houseId = this.neighborhood.addHouse(args);
    EventHelper.addClickListener(houseId, function() { this.sellToHouse(houseId) }.bind(this));
  }

  Controller.prototype.addSupplyOffer = function(args) {
    var offer = new SupplyOffer(args);
    EventHelper.addClickListener(offer.id, function() { this.buyProduct(offer.id) }.bind(this));
    this.supplyOffers.push(offer);
    return this.supplyOffers;
  }

  Controller.prototype.addAdvertisement = function(args) {
    var method = new Advertisement(args);
    EventHelper.addClickListener(method.id, function() { this.purchaseAdvertising(method.id) }.bind(this));
    this.advertisements.push(method);
    return this.advertisements;
  }

  Controller.prototype.addPropertyUpgrade = function() {
    EventHelper.addClickListener('property-upgrade-button', function() { this.resourceManager.increaseCapacity() }.bind(this));
  }

  Controller.prototype.addPurchasableSwitches = function() {
    EventHelper.addPurchasableSwitch("marketplace-switch", "marketplace");
    EventHelper.addPurchasableSwitch("property-switch", "property-upgrades");
    EventHelper.addPurchasableSwitch("map-switch", "map-options");
    EventHelper.addPurchasableSwitch("advertising-switch", "advertising");
    EventHelper.addPurchasableSwitch("lobbying-switch", "lobbying-options");
    EventHelper.addPurchasableSwitch("labor-switch", "labor-options");
  }

  return Controller;
})
