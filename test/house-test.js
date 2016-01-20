var requirejs = require("requirejs");
var should = require("should");

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    presenters: '../test/mocks/presenters'
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
      house.presenter = {refresh: function() {}};
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
});
