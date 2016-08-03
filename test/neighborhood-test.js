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
    emptyHood = new Neighborhood;
    fullHood = new Neighborhood;
    for (var i = 0; i < 5; i++) {
      fullHood.houses.push(new House({budget: 80, frequency: 5, active: true, hypeToActivate: 0}));
    }
  })

  describe('#instantiation', function(){
    it('should create new instances of Neighborhood', function(){
      emptyHood.should.have.property('houses', []);
    });
  });

  describe('#addHouse', function(){
    it('adds House objects to the neighborhood', function(){
      emptyHood.addHouse({budget: 100, frequency: 10, active: true, hypeToActivate: 0}).should.match(/house-.*/);
      emptyHood.houses.should.have.length(1);
      emptyHood.houses[0].should.be.an.instanceOf(House);
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

  describe('#findHouse', function() {
    it('returns the house in the collection that matches the ID provided', function() {
      var houseToFind = {id: "house-15"};
      emptyHood.houses = [{id: "house-10"}, houseToFind, {id: "house-20"}];
      emptyHood.findHouse("house-15").should.equal(houseToFind);
    });
  });

  describe('#updateHype', function() {
    it('calls #updateHype on every house', function() {
      var spies = fullHood.houses.map(function(house) { return sinon.spy(house, "updateHype") });
      fullHood.updateHype();
      spies.forEach(function(spy) {
        spy.called.should.eql(true);
      });
    });
  });
});
