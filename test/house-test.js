var requirejs = require("requirejs");
var should = require("should");

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    presenters: '../test/mocks/presenters',
    errors: '../test/mocks/errors'
  }
});

describe('House', function() {
  var House;
  before(function(done) {
    requirejs(['models/house'], function(house) {
      House = house;
      done();
    });
  });

  describe('#instantiation', function(){
    it('should create new instances of House', function(){
      var house = new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
      house.should.have.property('budget', 80);
      house.should.have.property('frequency', 5);
      house.should.have.property('active', true);
      house.should.have.property('hypeToActivate', 0);
      house.should.have.property('willingToBuy', false);
      house.should.have.property('id');
    });

    it('should have an id starting with "house-"', function() {
      var house = new House({});
      house.id.should.match(/house-.*/);
    });

    it('should set defaults', function() {
      var house = new House({});
      house.hypeToActivate.should.eql(0);
      house.active.should.eql(false);
      house.willingToBuy.should.eql(false);
    });
  });

  describe('#currentBudget', function() {
    it('returns a value based on the base budget and current hype', function() {
      var house = new House({budget: 100, frequency: 5, active: true, hypeToActivate: 0});
      house.marketingManager.level = function() { return 5 }; // stubbing out #level on the mocked MarketingManager
      house.currentBudget().should.eql(114);
      house.marketingManager.level = function() {};
    });
  });

  describe('#currentFrequency', function() {
    it('returns a value based on the base frequency and current hype', function() {
      var house = new House({budget: 100, frequency: 100, active: true, hypeToActivate: 0});
      house.marketingManager.level = function() { return 5 }; // stubbing out #level on the mocked MarketingManager
      house.currentFrequency().should.eql(88);
      house.marketingManager.level = function() {};
    });
  });

  describe('#readyText', function() {
    it('returns "$ READY $" when the house is active and willing to buy', function() {
      var house = new House({});
      house.active = true;
      house.willingToBuy = true;
      house.readyText().should.eql("$ Ready $");
    });

    it('returns "Not ready" when the house is not active', function() {
      var house = new House({});
      house.active = false;
      house.willingToBuy = true;
      house.readyText().should.eql("Not ready");
    });

    it('returns "Not ready" when the house is not willing to buy', function() {
      var house = new House({});
      house.active = true;
      house.willingToBuy = false;
      house.readyText().should.eql("Not ready");
    });
  });

  describe('#ready', function() {
    it('returns true when the house is active and willing to buy', function() {
      var house = new House({});
      house.active = true;
      house.willingToBuy = true;
      house.ready().should.eql(true);
    });

    it('returns false when the house is not active', function() {
      var house = new House({});
      house.active = false;
      house.willingToBuy = true;
      house.ready().should.eql(false);
    });

    it('returns false when the house is not willing to buy', function() {
      var house = new House({});
      house.active = true;
      house.willingToBuy = false;
      house.ready().should.eql(false);
    });
  });

  describe('#daysUntilReady', function() {
    it('given the current absolute day, returns the days until this house is ready to buy', function() {
      var house = new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
      house.marketingManager.level = function() { return 1 };
      house.daysUntilReady(9).should.eql(1);
      house.marketingManager.level = function() {};
    });

    it('given the current absolute day, returns the days until this house is ready to buy', function() {
      var house = new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
      house.marketingManager.level = function() { return 1 };
      house.daysUntilReady(10).should.eql(0);
      house.marketingManager.level = function() {};
    });
  });

  describe('#sell', function() {
    it('returns 0 if house is not willing to buy', function() {
      var house = new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
      house.willingToBuy = false;
      house.sell().should.eql(0);
    });

    it('returns the house\'s budget if willing to buy', function() {
      var house = new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0});
      house.willingToBuy = true;
      house.marketingManager.level = function() { return 1 };
      house.sell().should.eql(80);
      house.marketingManager.level = function() {};
    });
  });

  describe('#updateHype', function() {
    it('activates the house if hype level is sufficient', function() {
      var house = new House({budget: 80, frequency: 5, active: false, hypeToActivate: 2});
      house.active.should.eql(false);
      house.marketingManager.level = function() { return 2 };
      house.updateHype();
      house.active.should.eql(true);
    });

    it('does not activate the house if hype level is insufficient', function() {
      var house = new House({budget: 80, frequency: 5, active: false, hypeToActivate: 4});
      house.active.should.eql(false);
      house.marketingManager.level = function() { return 3 };
      house.updateHype();
      house.active.should.eql(false);
    });

    it('does not deactivate the house if hype level drops below sufficiency', function() {
      var house = new House({budget: 80, frequency: 5, active: false, hypeToActivate: 2});
      house.active.should.eql(false);
      house.marketingManager.level = function() { return 2 };
      house.updateHype();
      house.active.should.eql(true);
      house.marketingManager.level = function() { return 0 };
      house.active.should.eql(true);
    });
  });
});
