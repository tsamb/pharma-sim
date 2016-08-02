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

  it('should start with 0 hype', function(){
    mm.should.have.property('hype', 0);
  });

  describe('#level', function() {
    it('should start at level 1', function() {
      mm.level().should.eql(1);
    });

    it('should be level 1 until 1000 xp', function() {
      mm.hype = 500;
      mm.level().should.eql(1);
      mm.hype = 999;
      mm.level().should.eql(1);
    });

    it('should be level 2 between 1000 and 7999 xp', function() {
      mm.hype = 1000;
      mm.level().should.eql(2);
      mm.hype = 7999;
      mm.level().should.eql(2);
    });

    it('should be level 3 between 8000 and 26999 xp', function() {
      mm.hype = 8000;
      mm.level().should.eql(3);
      mm.hype = 26999;
      mm.level().should.eql(3);
    });

    it('should be level 4 between 27000 and 63999 xp', function() {
      mm.hype = 27000;
      mm.level().should.eql(4);
      mm.hype = 63999;
      mm.level().should.eql(4);
    });

    it('should be level 5 between 64000 and 124999 xp', function() {
      mm.hype = 64000;
      mm.level().should.eql(5);
      mm.hype = 124999;
      mm.level().should.eql(5);
    });
  });
});
