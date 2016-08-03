var requirejs = require("requirejs");
var should = require("should");
var sinon = require("sinon");

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    presenters: '../test/mocks/presenters',
    errors: '../test/mocks/errors'
  }
});

describe('Neighborhood', function() {
  var Neighborhood, emptyHood, fullHood, mockHouses;
  before(function(done) {
    requirejs(['models/neighborhood', 'models/house'], function(NeighborhoodConstructor, HouseConstructor) {
      Neighborhood = NeighborhoodConstructor;
      House = HouseConstructor;
      done();
    });
  });

  beforeEach(function() {
    emtpyHood = new Neighborhood;
    fullHood = new Neighborhood;
    for (var i = 0; i < 5; i++) {
      fullHood.houses.push(new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0}));
    }
  })

  describe('#instantiation', function(){
    it('should create new instances of Neighborhood', function(){
      emtpyHood.should.have.property('houses', []);
    });
  });

  describe('#addHouse', function(){
    it('adds House objects to the neighborhood', function(){
      emtpyHood.addHouse({budget: 100, frequency: 10, active: true, hypeToActivate: 0}).should.match(/house-.*/);
      emtpyHood.houses.should.have.length(1);
      emtpyHood.houses[0].should.be.an.instanceOf(House);
    });
  });

  describe('#updateHouseReadiness', function() {
    it('calls #updateReadiness on every house', function() {
      var spies = fullHood.houses.map(function(house) { return sinon.spy(house, "updateReadiness") });
      fullHood.updateHouseReadiness();
      spies.forEach(function(spy) {
        spy.called.should.eql(true);
      });
    });
  });
});
