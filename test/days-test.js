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

describe('Days', function() {
  var Days, days;
  before(function(done) {
    requirejs(['models/days'], function(DaysConstructor) {
      Days = DaysConstructor;
      done();
    });
  });

  beforeEach(function() {
    days = new Days;
  });

  describe('#instantiation', function(){
    it('should create new instances of Days with a count starting at 1', function(){
      days.should.have.property('count', 1);
    });
  });

  describe('#increment', function(){
    it('should increase the count by one', function(){
      days.increment();
      days.count.should.eql(2);
    });
  });
});
