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

describe('NeighborhoodGenerator', function() {
  var NeighborhoodGenerator;
  before(function(done) {
    requirejs(['models/neighborhood-generator'], function(NeighborhoodGeneratorFunction) {
      NeighborhoodGenerator = NeighborhoodGeneratorFunction;
      done();
    });
  });

  it('returns an array of 15 House arguments as objects', function(){
    NeighborhoodGenerator.generate().length.should.eql(15);
  });

  describe('each argument', function() {
    it('has budget, frequency and hypeToActivate properties', function(){
      NeighborhoodGenerator.generate()[0].should.have.property('budget');
      NeighborhoodGenerator.generate()[0].should.have.property('frequency');
      NeighborhoodGenerator.generate()[0].should.have.property('hypeToActivate');
    });

    it('has a whole number for its budget property', function() {
      NeighborhoodGenerator.generate().forEach(function(neighborhoodArg) {
        var budget = neighborhoodArg.budget;
        var budgetFraction = budget % 1;
        budgetFraction.should.not.be.greaterThan(0, 'expected ' + budget + ' to be a whole number');
      });
    });
  });
});
