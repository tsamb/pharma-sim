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

describe('MarketingManager', function() {
  var mm;
  before(function(done) {
    requirejs(['models/marketing-manager'], function(MarketingManagerSingleton) {
      mm = MarketingManagerSingleton;
      done();
    });
  });

  after(function() {
    mm.hype = 0;
  });

  it('should start with 0 hype', function(){
    mm.should.have.property('hype', 0);
  });

  describe('#level', function() {
    it('should start at level 1', function() {
      mm.level().should.eql(1);
    });

    it('should be level 1 until 1000 hype', function() {
      mm.hype = 500;
      mm.level().should.eql(1);
      mm.hype = 999;
      mm.level().should.eql(1);
    });

    it('should be level 2 between 1000 and 7999 hype', function() {
      mm.hype = 1000;
      mm.level().should.eql(2);
      mm.hype = 7999;
      mm.level().should.eql(2);
    });

    it('should be level 3 between 8000 and 26999 hype', function() {
      mm.hype = 8000;
      mm.level().should.eql(3);
      mm.hype = 26999;
      mm.level().should.eql(3);
    });

    it('should be level 4 between 27000 and 63999 hype', function() {
      mm.hype = 27000;
      mm.level().should.eql(4);
      mm.hype = 63999;
      mm.level().should.eql(4);
    });

    it('should be level 5 between 64000 and 124999 hype', function() {
      mm.hype = 64000;
      mm.level().should.eql(5);
      mm.hype = 124999;
      mm.level().should.eql(5);
    });
  });

  describe('#currentLevelReachedAt', function() {
    it('calculates the amount of hype the current level was reached at', function() {
      mm.hype = 0;
      mm.currentLevelReachedAt().should.eql(0);
    });

    it('should be 0 until 1000', function() {
      mm.hype = 999;
      mm.currentLevelReachedAt().should.eql(0);
    });

    it('should be 1000 until 8000', function() {
      mm.hype = 1000;
      mm.currentLevelReachedAt().should.eql(1000);
      mm.hype = 7999;
      mm.currentLevelReachedAt().should.eql(1000);
    });

    it('should work for all levels', function() {
      mm.hype = 112000;
      mm.currentLevelReachedAt().should.eql(64000);
    });
  });

  describe('#nextLevelReachedAt', function() {
    it('calculates the amount of total hype to reach the next level', function() {
      mm.hype = 0;
      mm.nextLevelReachedAt().should.eql(1000);
    });

    it('should be 1000 between 0 and 999', function() {
      mm.hype = 500;
      mm.nextLevelReachedAt().should.eql(1000);
      mm.hype = 999;
      mm.nextLevelReachedAt().should.eql(1000);
    });

    it('should be 8000 between 1000 and 7999', function() {
      mm.hype = 1000;
      mm.nextLevelReachedAt().should.eql(8000);
      mm.hype = 7999;
      mm.nextLevelReachedAt().should.eql(8000);
    });

    it('should work for all levels', function() {
      mm.hype = 112000;
      mm.nextLevelReachedAt().should.eql(125000);
    });
  });

  describe('#hypeGainedThisLevel', function() {
    it('calculates how much xp has been gained this level', function() {
      mm.hype = 1600;
      mm.hypeGainedThisLevel().should.eql(600);
    });
  });

  describe('#hypeRemainingThisLevel', function() {
    it('calculates how much xp required to gain the next level', function() {
      mm.hype = 1600;
      mm.hypeRemainingThisLevel().should.eql(6400);
    });
  });

  describe('#hypeBetweenCurrentLevels', function() {
    it('calculates the xp spread between the current and next levels', function() {
      mm.hype = 1600;
      mm.hypeBetweenCurrentLevels().should.eql(7000);
    });
  });

  describe('#percentageOfCurrentLevelComplete', function() {
    it('expresses the progress towards the next level as a percentage', function() {
      mm.hype = 4500;
      mm.percentageOfCurrentLevelComplete().should.eql(50);
      mm.hype = 124999;
      mm.percentageOfCurrentLevelComplete().should.eql(99);
    });
  });

  describe('#increaseHype', function() {
    it('increases the hype by the given amount', function() {
      mm.hype = 0;
      mm.increaseHype(2500);
      mm.hype.should.eql(2500);
      mm.increaseHype(400);
      mm.hype.should.eql(2900);
    });
  });

  describe('#decreaseHype', function() {
    it('decreases the hype by the given amount', function() {
      mm.hype = 5000;
      mm.decreaseHype(1000);
      mm.hype.should.eql(4000);
      mm.decreaseHype(600);
      mm.hype.should.eql(3400);
    });

    it('cannot decrease the hype below 0', function() {
      mm.hype = 100;
      mm.decreaseHype(500);
      mm.hype.should.eql(0);
      mm.decreaseHype(200);
      mm.hype.should.eql(0);
    });
  });

  describe('#organicHypeFade', function() {
    it('decreases the hype by a quotient relative to the current hype', function() {
      mm.hype = 10000;
      mm.organicHypeFade();
      mm.hype.should.eql(9900);
      mm.organicHypeFade();
      mm.hype.should.eql(9801);
    });
  });
});
