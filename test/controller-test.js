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
  var Controller, House, cont, sandbox;
  before(function(done) {
    requirejs(['controller', 'models/house', 'models/supply-offer'], function(ControllerConstructor, HouseConstructor, SupplyOfferConstructor) {
      Controller = ControllerConstructor;
      House = HouseConstructor;
      SupplyOffer = SupplyOfferConstructor;
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

      cont.neighborhood.houses.should.not.be.empty();
      cont.supplyOffers.should.not.be.empty();
      cont.advertisements.should.not.be.empty();
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

  describe('#purchaseMarketing', function() {
    it('', function() {

    });
  });

  describe('#addHouse', function() {
    it('', function() {

    });
  });

  describe('#addSupplyOffer', function() {
    it('', function() {

    });
  });

  describe('#addAdvertisement', function() {
    it('', function() {

    });
  });

  describe('#addPropertyUpgrade', function() {
    it('', function() {

    });
  });

  describe('#addPurchasableSwitches', function() {
    it('', function() {

    });
  });
});
