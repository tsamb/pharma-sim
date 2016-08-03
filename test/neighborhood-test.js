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
  var Neighborhood, hood, mockHouses;
  before(function(done) {
    requirejs(['models/neighborhood', 'models/house'], function(NeighborhoodConstructor, HouseConstructor) {
      Neighborhood = NeighborhoodConstructor;
      House = HouseConstructor;
      done();
    });
  });

  beforeEach(function() {
    hood = new Neighborhood;
    houses = [];
    for (var i = 0; i < 5; i++) {
      houses.push(new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0}))
    }
  })

  describe('#instantiation', function(){
    it('should create new instances of Neighborhood', function(){
      hood.should.have.property('houses', []);
    });
  });

  describe('#addHouse', function(){
    it('adds House objects to the neighborhood', function(){
      hood.addHouse({budget: 100, frequency: 10, active: true, hypeToActivate: 0}).should.match(/house-.*/);
      hood.houses.should.have.length(1);
      hood.houses[0].should.be.an.instanceOf(House);
    });
  });
});
