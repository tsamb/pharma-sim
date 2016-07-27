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
  var Days;
  before(function(done) {
    requirejs(['models/days'], function(DaysConstructor) {
      Days = DaysConstructor;
      done();
    });
  });

  describe('#instantiation', function(){
    it('should create new instances of Days with a count starting at 1', function(){
      var days = new Days;
      days.should.have.property('count', 1);
    });
  });

});
