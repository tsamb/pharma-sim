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
  var HouseConstructor, mmMockGenerator, defaultHouse, basicHouse;
  before(function(done) {
    requirejs(['models/house'], function(House) {
      HouseConstructor = House;
      mmMockGenerator = function(level) {
        // return a mock of the MarketingManager that does not touch the actual singleton
        return {level: function() { return level }};
      }
      done();
    });
  });

  beforeEach(function(done) {
    defaultHouse = new HouseConstructor({});
    defaultHouse.marketingManager = mmMockGenerator(1);
    basicHouse = new HouseConstructor({budget: 80, frequency: 5, active: true, hypeToActivate: 0})
    basicHouse.marketingManager = mmMockGenerator(1);
    done();
  })

  describe('#instantiation', function(){
    it('should create new instances of House', function(){
      basicHouse.should.have.property('budget', 80);
      basicHouse.should.have.property('frequency', 5);
      basicHouse.should.have.property('active', true);
      basicHouse.should.have.property('hypeToActivate', 0);
      basicHouse.should.have.property('willingToBuy', false);
      basicHouse.should.have.property('id');
    });

    it('should have an id starting with "house-"', function() {
      defaultHouse.id.should.match(/house-.*/);
    });

    it('should set defaults', function() {
      defaultHouse.hypeToActivate.should.eql(0);
      defaultHouse.active.should.eql(false);
      defaultHouse.willingToBuy.should.eql(false);
    });
  });

  describe('#currentBudget', function() {
    it('returns a value based on the base budget and current hype', function() {
      defaultHouse.budget = 100;
      defaultHouse.marketingManager = mmMockGenerator(5)
      defaultHouse.currentBudget().should.eql(114);
    });
  });

  describe('#currentFrequency', function() {
    it('returns a value based on the base frequency and current hype', function() {
      defaultHouse.frequency = 100;
      defaultHouse.marketingManager = mmMockGenerator(5);
      defaultHouse.currentFrequency().should.eql(88);
    });
  });

  describe('#readyText', function() {
    it('returns "$ READY $" when the house is active and willing to buy', function() {
      defaultHouse.active = true;
      defaultHouse.willingToBuy = true;
      defaultHouse.readyText().should.eql("$ Ready $");
    });

    it('returns "Not ready" when the house is not active', function() {
      defaultHouse.active = false;
      defaultHouse.willingToBuy = true;
      defaultHouse.readyText().should.eql("Not ready");
    });

    it('returns "Not ready" when the house is not willing to buy', function() {
      defaultHouse.active = true;
      defaultHouse.willingToBuy = false;
      defaultHouse.readyText().should.eql("Not ready");
    });
  });

  describe('#ready', function() {
    it('returns true when the house is active and willing to buy', function() {
      defaultHouse.active = true;
      defaultHouse.willingToBuy = true;
      defaultHouse.ready().should.eql(true);
    });

    it('returns false when the house is not active', function() {
      defaultHouse.active = false;
      defaultHouse.willingToBuy = true;
      defaultHouse.ready().should.eql(false);
    });

    it('returns false when the house is not willing to buy', function() {
      defaultHouse.active = true;
      defaultHouse.willingToBuy = false;
      defaultHouse.ready().should.eql(false);
    });
  });

  describe('#daysUntilReady', function() {
    it('given the current absolute day, returns the days until this house is ready to buy', function() {
      basicHouse.daysUntilReady(9).should.eql(1);
      basicHouse.daysUntilReady(10).should.eql(0);
    });
  });

  describe('#sell', function() {
    it('returns 0 if house is not willing to buy', function() {
      basicHouse.willingToBuy = false;
      basicHouse.sell().should.eql(0);
    });

    it('returns the house\'s budget if willing to buy', function() {
      basicHouse.willingToBuy = true;
      basicHouse.sell().should.eql(80);
    });
  });

  describe('#updateHype', function() {
    it('activates the house if hype level is sufficient', function() {
      basicHouse.active = false;
      basicHouse.hypeToActivate = 2;
      basicHouse.marketingManager = mmMockGenerator(2);
      basicHouse.updateHype();
      basicHouse.active.should.eql(true);
    });

    it('does not activate the house if hype level is insufficient', function() {
      basicHouse.active = false;
      basicHouse.hypeToActivate = 4;
      basicHouse.marketingManager = mmMockGenerator(3);
      basicHouse.updateHype();
      basicHouse.active.should.eql(false);
    });

    it('does not deactivate the house if hype level drops below sufficiency', function() {
      basicHouse.active = false;
      basicHouse.hypeToActivate = 2;
      basicHouse.marketingManager = mmMockGenerator(2);
      basicHouse.updateHype();
      basicHouse.active.should.eql(true);
      basicHouse.marketingManager = mmMockGenerator(1);
      basicHouse.updateHype();
      basicHouse.active.should.eql(true);
    });
  });

  describe('#updateReadiness', function() {
    it('flags house as willing-to-buy if it hits exactly 0 days until ready', function() {
      basicHouse.willingToBuy.should.eql(false);
      basicHouse.updateReadiness(10);
      basicHouse.willingToBuy.should.eql(true);
    });
  });
});
