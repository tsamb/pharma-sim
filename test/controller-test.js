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
  var Controller, cont;
  before(function(done) {
    requirejs(['controller'], function(ControllerConstructor) {
      Controller = ControllerConstructor;
      done();
    });
  });

  beforeEach(function() {
    cont = new Controller;
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
      var readinessMethodSpy = sinon.spy(cont.neighborhood, "updateHouseReadiness");

      cont.coreCycle();

      readinessMethodSpy.called.should.eql(true, 'expected Neighborhood#updateHouseReadiness to be called')
    });

    it('fades the hype', function() {
      var hypeFadeMethodSpy = sinon.spy(cont.marketingManager, "organicHypeFade");

      cont.coreCycle();

      hypeFadeMethodSpy.called.should.eql(true, 'expected MarketingManager#organicHypeFade to be called')
    });

    it('updates houses with the current hype', function() {
      // move this updating to pub/sub? i.e. each house subscribes to a "hype change" event?
      var updateHypeMethodSpy = sinon.spy(cont.neighborhood, "updateHype");

      cont.coreCycle();

      updateHypeMethodSpy.called.should.eql(true, 'expected Neighborhood#updateHype to be called')
    });
  });

  describe('#sellToHouse', function() {
    it('', function() {

    });
  });

  describe('#buyProduct', function() {
    it('', function() {

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
