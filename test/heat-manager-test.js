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

describe('HeatManager', function() {
  var hm;
  before(function(done) {
    requirejs(['models/heat-manager'], function(HeatManagerSingleton) {
      hm = HeatManagerSingleton;
      done();
    });
  });

  after(function() {
    hm.heat = 0;
  });

  it('should start with 0 heat', function(){
    hm.should.have.property('heat', 0);
  });

  describe('#level', function() {
    it('should start at level 1', function() {
      hm.level().should.eql(1);
    });

    it('should be level 1 until 1000 heat', function() {
      hm.heat = 500;
      hm.level().should.eql(1);
      hm.heat = 999;
      hm.level().should.eql(1);
    });

    it('should be level 2 between 1000 and 7999 heat', function() {
      hm.heat = 1000;
      hm.level().should.eql(2);
      hm.heat = 7999;
      hm.level().should.eql(2);
    });

    it('should be level 3 between 8000 and 26999 heat', function() {
      hm.heat = 8000;
      hm.level().should.eql(3);
      hm.heat = 26999;
      hm.level().should.eql(3);
    });

    it('should be level 4 between 27000 and 63999 heat', function() {
      hm.heat = 27000;
      hm.level().should.eql(4);
      hm.heat = 63999;
      hm.level().should.eql(4);
    });

    it('should be level 5 between 64000 and 124999 heat', function() {
      hm.heat = 64000;
      hm.level().should.eql(5);
      hm.heat = 124999;
      hm.level().should.eql(5);
    });
  });

  describe('#currentLevelReachedAt', function() {
    it('calculates the amount of heat the current level was reached at', function() {
      hm.heat = 0;
      hm.currentLevelReachedAt().should.eql(0);
    });

    it('should be 0 until 1000', function() {
      hm.heat = 999;
      hm.currentLevelReachedAt().should.eql(0);
    });

    it('should be 1000 until 8000', function() {
      hm.heat = 1000;
      hm.currentLevelReachedAt().should.eql(1000);
      hm.heat = 7999;
      hm.currentLevelReachedAt().should.eql(1000);
    });

    it('should work for all levels', function() {
      hm.heat = 112000;
      hm.currentLevelReachedAt().should.eql(64000);
    });
  });

  describe('#nextLevelReachedAt', function() {
    it('calculates the amount of total heat to reach the next level', function() {
      hm.heat = 0;
      hm.nextLevelReachedAt().should.eql(1000);
    });

    it('should be 1000 between 0 and 999', function() {
      hm.heat = 500;
      hm.nextLevelReachedAt().should.eql(1000);
      hm.heat = 999;
      hm.nextLevelReachedAt().should.eql(1000);
    });

    it('should be 8000 between 1000 and 7999', function() {
      hm.heat = 1000;
      hm.nextLevelReachedAt().should.eql(8000);
      hm.heat = 7999;
      hm.nextLevelReachedAt().should.eql(8000);
    });

    it('should work for all levels', function() {
      hm.heat = 112000;
      hm.nextLevelReachedAt().should.eql(125000);
    });
  });

  describe('#heatGainedThisLevel', function() {
    it('calculates how much xp has been gained this level', function() {
      hm.heat = 1600;
      hm.heatGainedThisLevel().should.eql(600);
    });
  });

  describe('#heatRemainingThisLevel', function() {
    it('calculates how much xp required to gain the next level', function() {
      hm.heat = 1600;
      hm.heatRemainingThisLevel().should.eql(6400);
    });
  });

  describe('#heatBetweenCurrentLevels', function() {
    it('calculates the xp spread between the current and next levels', function() {
      hm.heat = 1600;
      hm.heatBetweenCurrentLevels().should.eql(7000);
    });
  });

  describe('#percentageOfCurrentLevelComplete', function() {
    it('expresses the progress towards the next level as a percentage', function() {
      hm.heat = 4500;
      hm.percentageOfCurrentLevelComplete().should.eql(50);
      hm.heat = 124999;
      hm.percentageOfCurrentLevelComplete().should.eql(99);
    });
  });

  describe('#increaseHeat', function() {
    it('increases the heat by the given amount', function() {
      hm.heat = 0;
      hm.increaseHeat(2500);
      hm.heat.should.eql(2500);
      hm.increaseHeat(400);
      hm.heat.should.eql(2900);
    });
  });

  describe('#decreaseHeat', function() {
    it('decreases the heat by the given amount', function() {
      hm.heat = 5000;
      hm.decreaseHeat(1000);
      hm.heat.should.eql(4000);
      hm.decreaseHeat(600);
      hm.heat.should.eql(3400);
    });

    it('cannot decrease the heat below 0', function() {
      hm.heat = 100;
      hm.decreaseHeat(500);
      hm.heat.should.eql(0);
      hm.decreaseHeat(200);
      hm.heat.should.eql(0);
    });
  });

  describe('#organicHeatFade', function() {
    it('decreases the heat by a quotient relative to the current heat', function() {
      hm.heat = 10000;
      hm.organicHeatFade();
      hm.heat.should.eql(9900);
      hm.organicHeatFade();
      hm.heat.should.eql(9801);
    });
  });
});
