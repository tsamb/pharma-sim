define(['models/resource-manager',
'models/house',
'models/supply-offer',
'models/days',
'models/neighborhood',
'models/marketing-manager',
'models/advertisement',
'helpers/event-helper',
'models/neighborhood-generator'],
function(ResourceManager, House, SupplyOffer, Days, Neighborhood, MarketingManager, Advertisement, EventHelper, NeighborhoodGenerator) {
  var Controller = function() {
    this.days = new Days;
    this.resourceManager = new ResourceManager;
    this.neighborhood = new Neighborhood;
    this.marketingManager = MarketingManager;
    this.supplyOffers = [];
    this.advertisements = [];
  }

  // <<<<<<<< INITIAL SET UP >>>>>>>>

  var DEFAULT_HOUSE_ARGS = [
    {budget: 80, frequency: 5, active: true, hypeToActivate: 1},
    {budget: 120, frequency: 20, active: true, hypeToActivate: 1},
    {budget: 150, frequency: 23, active: true, hypeToActivate: 1},
    {budget: 250, frequency: 30, active: true, hypeToActivate: 1},
    {budget: 150, frequency: 25, active: false, hypeToActivate: 2},
    {budget: 180, frequency: 27, active: false, hypeToActivate: 2},
    {budget: 200, frequency: 18, active: false, hypeToActivate: 3},
    {budget: 300, frequency: 60, active: false, hypeToActivate: 4},
    {budget: 140, frequency: 16, active: false, hypeToActivate: 4},
    {budget: 100, frequency: 5, active: false, hypeToActivate: 4},
    {budget: 140, frequency: 22, active: false, hypeToActivate: 5},
    {budget: 120, frequency: 15, active: false, hypeToActivate: 5},
    {budget: 180, frequency: 12, active: false, hypeToActivate: 6},
    {budget: 320, frequency: 40, active: false, hypeToActivate: 6},
    {budget: 240, frequency: 10, active: false, hypeToActivate: 7}
  ];

  var OFFER_ARGS = [
    {amount: 10, price: 1000},
    {amount: 100, price: 7500},
    {amount: 500, price: 30000},
    {amount: 1000, price: 50000}
  ];

  var AD_ARGS = [
    {name: "Paper Boy", price: 500, hype: 1500},
    {name: "Flyer Drop", price: 2000, hype: 8000},
    {name: "Flyer Handout", price: 4000, hype: 20000},
    {name: "Referral Program", price: 10000, hype: 60000},
    {name: "Social Media", price: 30000, hype: 210000},
    {name: "Web Banner Ads", price: 50000, hype: 400000},
    {name: "Billboard", price: 100000, hype: 1000000},
    {name: "TV Spot", price: 500000, hype: 6000000},
    {name: "Superbowl Ad", price: 3000000, hype: 45000000}
  ];

  Controller.prototype.init = function() {
    NeighborhoodGenerator.generate().forEach(function(args) { this.addHouse(args) }.bind(this));
    // DEFAULT_HOUSE_ARGS.forEach(function(args) { this.addHouse(args) }.bind(this));
    OFFER_ARGS.forEach(function(args) { this.addSupplyOffer(args) }.bind(this));
    AD_ARGS.forEach(function(args) { this.addAdvertisement(args) }.bind(this));
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

  Controller.prototype.purchaseAdvertising = function(adId) {
    var ad = this.advertisements.find(function(ad) { return ad.id === adId });
    if (ad && this.resourceManager.cashIsAvailable(ad.price)) {
      this.resourceManager.processPurchase(ad.price);
      this.marketingManager.increaseHype(ad.hype);
    }
  }

  // <<<<<<<< MODEL INSTANTIATORS / EVENT BINDINGS >>>>>>>>

  Controller.prototype.addHouse = function(args) {
    var houseId = this.neighborhood.addHouse(args);
    EventHelper.addClickListener(houseId, this.onSellToHouse.bind(this, houseId));
  }

  Controller.prototype.addSupplyOffer = function(args) {
    var offer = new SupplyOffer(args);
    EventHelper.addClickListener(offer.id, this.onBuyProduct.bind(this, offer.id));
    this.supplyOffers.push(offer);
    return this.supplyOffers;
  }

  Controller.prototype.addAdvertisement = function(args) {
    var method = new Advertisement(args);
    EventHelper.addClickListener(method.id, this.onPurchaseAdvertising.bind(this, method.id));
    this.advertisements.push(method);
    return this.advertisements;
  }

  Controller.prototype.addPropertyUpgrade = function() {
    EventHelper.addClickListener('property-upgrade-button', this.onAddProperty.bind(this));
  }

  Controller.prototype.addPurchasableSwitches = function() {
    EventHelper.addPurchasableSwitch("marketplace-switch", "marketplace");
    EventHelper.addPurchasableSwitch("property-switch", "property-upgrades");
    EventHelper.addPurchasableSwitch("map-switch", "map-options");
    EventHelper.addPurchasableSwitch("advertising-switch", "advertising");
    EventHelper.addPurchasableSwitch("lobbying-switch", "lobbying-options");
    EventHelper.addPurchasableSwitch("labor-switch", "labor-options");
  }

  // <<<<<<<< EVENT CALLBACKS >>>>>>>>

  Controller.prototype.onSellToHouse = function(houseId) {
    this.sellToHouse(houseId);
  }

  Controller.prototype.onBuyProduct = function(offerId) {
    this.buyProduct(offerId);
  }

  Controller.prototype.onPurchaseAdvertising = function(methodId) {
    this.purchaseAdvertising(methodId);
  }

  Controller.prototype.onAddProperty = function() {
    this.resourceManager.increaseCapacity();
  }

  return Controller;
})
