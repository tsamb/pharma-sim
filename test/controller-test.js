var requirejs = require("requirejs");
var should = require("should");
var sinon = require("sinon");

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    helpers: '../test/mocks/helpers',
    presenters: '../test/mocks/presenters',
    errors: '../test/mocks/errors'
  }
});

describe('Controller', function() {
  var Controller, House, SupplyOffer, Advertisement, EventHelper, cont, sandbox;
  before(function(done) {
    requirejs(['controller', 'models/house', 'models/supply-offer', 'models/advertisement', 'helpers/event-helper'], function(ControllerConstructor, HouseConstructor, SupplyOfferConstructor, AdConstructor, EventHelperModule) {
      Controller = ControllerConstructor;
      House = HouseConstructor;
      SupplyOffer = SupplyOfferConstructor;
      Advertisement = AdConstructor;
      EventHelper = EventHelperModule;
      done();
    });
  });

  beforeEach(function() {
    cont = new Controller;
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Initialization methods', function() {
    describe('#instantiation', function(){
      it('creates new instances of Controller', function(){
        cont.should.have.property('days');
        cont.should.have.property('resourceManager');
        cont.should.have.property('neighborhood');
        cont.should.have.property('marketingManager');
        cont.should.have.property('supplyOffers');
        cont.should.have.property('advertisements');
      });
    });

    describe('#init', function() {
      it('sets up neighborhoods, supply offers, ads, property upgrades', function() {
        cont.neighborhood.houses.should.be.empty();
        cont.supplyOffers.should.be.empty();
        cont.advertisements.should.be.empty();
        // cont.resourceManager.storageManager.propertyUpgrades.should.be.empty; // not yet implemented as options

        cont.init();

        cont.neighborhood.houses.length.should.eql(15);
        cont.supplyOffers.length.should.eql(4);
        cont.advertisements.length.should.eql(9);
      });
    });

    describe('#start', function() {
      xit('starts the core loop and saves the loop id', function() {

      });
    });

    describe('#coreCycle', function() {
      it('increments the days', function() {
        cont.days.count.should.eql(1);

        cont.coreCycle();

        cont.days.count.should.eql(2);
      });

      it('updates readiness of all houses', function() {
        var readinessMethodSpy = sandbox.spy(cont.neighborhood, "updateHouseReadiness");

        cont.coreCycle();

        readinessMethodSpy.called.should.eql(true, 'expected Neighborhood#updateHouseReadiness to be called')
      });

      it('fades the hype', function() {
        var hypeFadeMethodSpy = sandbox.spy(cont.marketingManager, "organicHypeFade");

        cont.coreCycle();

        hypeFadeMethodSpy.called.should.eql(true, 'expected MarketingManager#organicHypeFade to be called')
      });

      it('updates houses with the current hype', function() {
        // move this updating to pub/sub? i.e. each house subscribes to a "hype change" event?
        var updateHypeMethodSpy = sandbox.spy(cont.neighborhood, "updateHype");

        cont.coreCycle();

        updateHypeMethodSpy.called.should.eql(true, 'expected Neighborhood#updateHype to be called')
      });
    });
  });

  describe('Controller methods', function() {
    describe('#sellToHouse', function() {
      context('when the house exists, is ready and product is available', function() {
        it('processes the transaction for the house and the resource manager', function() {
          var house = new House({budget: 120, frequency: 20, active: true, hypeToActivate: 0});
          var sellMethodSpy = sandbox.spy(cont.resourceManager, "sellProduct");
          var houseSellSpy = sandbox.spy(house, "sell");
          house.willingToBuy = true;
          cont.neighborhood.houses.push(house);
          cont.resourceManager.product = 10;

          cont.sellToHouse(house.id);

          sellMethodSpy.called.should.eql(true, 'expected ResourceManager#sellProduct to be called');
          houseSellSpy.called.should.eql(true, 'expected House#sell to be called');
        });
      });

      context('when the house does not exist', function() {
        it('does nothing', function() {
          var sellMethodSpy = sandbox.spy(cont.resourceManager, "sellProduct");
          cont.resourceManager.product = 10;

          cont.sellToHouse("notahouse");

          sellMethodSpy.called.should.eql(false, 'expected ResourceManager#sellProduct not to be called');
        });
      });

      context('when the house is not ready', function() {
        it('does nothing', function() {
          var house = new House({budget: 120, frequency: 20, active: false, hypeToActivate: 0});
          var sellMethodSpy = sandbox.spy(cont.resourceManager, "sellProduct");
          var houseSellSpy = sandbox.spy(house, "sell");
          cont.neighborhood.houses.push(house);
          cont.resourceManager.product = 10;

          cont.sellToHouse(house.id);

          sellMethodSpy.called.should.eql(false, 'expected ResourceManager#sellProduct not to be called');
          houseSellSpy.called.should.eql(false, 'expected House#sell not to be called');
        });
      });

      context('when insufficient product is available', function() {
        it('does nothing', function() {
          var house = new House({budget: 120, frequency: 20, active: true, hypeToActivate: 0});
          var sellMethodSpy = sandbox.spy(cont.resourceManager, "sellProduct");
          var houseSellSpy = sandbox.spy(house, "sell");
          house.willingToBuy = true;
          cont.neighborhood.houses.push(house);
          cont.resourceManager.product = 0;

          cont.sellToHouse(house.id);

          sellMethodSpy.called.should.eql(false, 'expected ResourceManager#sellProduct not to be called');
          houseSellSpy.called.should.eql(false, 'expected House#sell not to be called');
        });
      });
    });

    describe('#buyProduct', function() {
      context('when the offer exists', function() {
        it('delegates purchasing to the resource manager', function() {
          var offer = new SupplyOffer({amount: 10, price: 1000});
          var buyMethodSpy = sandbox.spy(cont.resourceManager, "buyProduct");
          cont.supplyOffers.push(offer);
          cont.resourceManager.bankAccount = 2000;
          cont.resourceManager.product = 0;

          cont.buyProduct(offer.id);

          buyMethodSpy.calledWith(10, 1000).should.eql(true, 'expected ResourceManager#buyProduct to be called with args: 10, 1000');
        });
      });

      context('when the offer does not exists', function() {
        it('does nothing', function() {
          var buyMethodSpy = sandbox.spy(cont.resourceManager, "buyProduct");;

          cont.buyProduct("notanoffer");

          buyMethodSpy.called.should.eql(false, 'expected ResourceManager#buyProduct not to be called');
        });
      });
    });

    describe('#purchaseAdvertising', function() {
      context('when the ad exists and sufficient cash is available', function() {
        it('processes the purchase and increases the hype', function() {
          var ad = new Advertisement({name: "Test Ad", price: 300, hype: 900});
          cont.advertisements.push(ad);
          var purchaseMethodSpy = sandbox.spy(cont.resourceManager, "processPurchase");
          var hypeMethodSpy = sandbox.stub(cont.marketingManager, "increaseHype", function() {});
          cont.resourceManager.bankAccount = 1000;

          cont.purchaseAdvertising(ad.id);

          purchaseMethodSpy.calledWith(300).should.eql(true, 'expected ResourceManager#processPurchase to be called with 300');
          hypeMethodSpy.calledWith(900).should.eql(true, 'expected MarketingManager#increaseHype to be called with 900');
        });
      });

      context('when the ad doesn\'t exist', function() {
        it('does nothing', function() {
          var purchaseMethodSpy = sandbox.spy(cont.resourceManager, "processPurchase");
          var hypeMethodSpy = sandbox.stub(cont.marketingManager, "increaseHype", function() {});
          cont.resourceManager.bankAccount = 1000;

          cont.purchaseAdvertising("notanad");

          purchaseMethodSpy.called.should.eql(false, 'expected ResourceManager#processPurchase not to be called');
          hypeMethodSpy.called.should.eql(false, 'expected MarketingManager#increaseHype not to be called');
        });
      });

      context('when there is insufficient cash', function() {
        it('does nothing', function() {
          var ad = new Advertisement({name: "Test Ad", price: 300, hype: 900});
          cont.advertisements.push(ad);
          var purchaseMethodSpy = sandbox.spy(cont.resourceManager, "processPurchase");
          var hypeMethodSpy = sandbox.stub(cont.marketingManager, "increaseHype", function() {});
          cont.resourceManager.bankAccount = 200;

          cont.purchaseAdvertising(ad.id);

          purchaseMethodSpy.called.should.eql(false, 'expected ResourceManager#processPurchase not to be called');
          hypeMethodSpy.called.should.eql(false, 'expected MarketingManager#increaseHype not to be called');
        });
      });
    });
  });

  describe('Model instantiators and event bindings', function() {
    describe('#addHouse', function() {
      it('adds a house to the neighborhood and sets up a click listener', function() {
        var houseAddSpy = sandbox.spy(cont.neighborhood, "addHouse");
        var eventListenerSpy = sandbox.spy(EventHelper, "addClickListener");

        cont.addHouse({budget: 240, frequency: 10, active: false, hypeToActivate: 7});

        houseAddSpy.called.should.eql(true, 'expected Neighborhood#addHouse to be called');
        eventListenerSpy.called.should.eql(true);
      });
    });

    describe('#addSupplyOffer', function() {
      it('adds a supply offer to the collection and sets up a click listener', function() {
        var eventListenerSpy = sandbox.spy(EventHelper, "addClickListener");
        cont.supplyOffers.should.be.empty();

        cont.addSupplyOffer({amount: 20, price: 1500});

        cont.supplyOffers.should.not.be.empty();
        eventListenerSpy.called.should.eql(true);
      });
    });

    describe('#addAdvertisement', function() {
      it('adds an advertisement to the collection and sets up a click listener', function() {
        var eventListenerSpy = sandbox.spy(EventHelper, "addClickListener");
        cont.advertisements.should.be.empty();

        cont.addAdvertisement({name: "Test Ad", price: 500, hype: 1200});

        cont.advertisements.should.not.be.empty();
        eventListenerSpy.called.should.eql(true);
      });
    });

    describe('#addPropertyUpgrade', function() {
      it('sets up a click listener for upgrading storage space', function() {
        var eventListenerSpy = sandbox.spy(EventHelper, "addClickListener");

        cont.addPropertyUpgrade();

        eventListenerSpy.called.should.eql(true);
      });
    });

    describe('#addPurchasableSwitches', function() {
      it('delegates DOM manipulation to the event helper for each one of the 6 purchase types', function() {
        var eventListenerSpy = sandbox.spy(EventHelper, "addPurchasableSwitch");

        cont.addPurchasableSwitches();

        eventListenerSpy.callCount.should.eql(6);
      });
    });
  });

  describe('Event callbacks', function() {
    describe('#onSellToHouse', function() {
      it('calls the relevant controller method', function() {
        var contMethodSpy = sandbox.stub(cont, 'onSellToHouse');

        cont.onSellToHouse("test-house-id");

        contMethodSpy.calledWith("test-house-id").should.eql(true, 'expected #onSellToHouse to be called with "test-house-id"');
      });
    });

    describe('#onBuyProduct', function() {
      it('calls the relevant controller method', function() {
        var contMethodSpy = sandbox.stub(cont, 'onBuyProduct');

        cont.onBuyProduct("test-offer-id");

        contMethodSpy.calledWith("test-offer-id").should.eql(true, 'expected #onBuyProduct to be called with "test-offer-id"');
      });
    });

    describe('#onPurchaseAdvertising', function() {
      it('calls the relevant controller method', function() {
        var contMethodSpy = sandbox.stub(cont, 'onPurchaseAdvertising');

        cont.onPurchaseAdvertising("test-ad-id");

        contMethodSpy.calledWith("test-ad-id").should.eql(true, 'expected #onPurchaseAdvertising to be called with "test-ad-id"');
      });
    });

    describe('#onAddProperty', function() {
      it('calls the relevant controller method', function() {
        var contMethodSpy = sandbox.stub(cont, 'onAddProperty');

        cont.onAddProperty();

        contMethodSpy.called.should.eql(true, 'expected #onAddProperty to be called');
      });
    });
  });
});
