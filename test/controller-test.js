var requirejs = require("requirejs");
var should = require("should");
var sinon = require("sinon");

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    helpers: '../test/mocks/helpers',
    presenters: '../test/mocks/presenters',
    errors: '../test/mocks/errors'
  }
});

describe('Controller', function() {
  var Controller;
  before(function(done) {
    requirejs(['controller'], function(ControllerConstructor) {
      Controller = ControllerConstructor;
      done();
    });
  });

  beforeEach(function() {
    
  });

  describe('#instantiation', function(){
    it('creates new instances of Controller', function(){
      var cont = new Controller;
      cont.should.have.property('days');
      cont.should.have.property('resourceManager');
      cont.should.have.property('neighborhood');
      cont.should.have.property('marketingManager');
      cont.should.have.property('supplyOffers');
      cont.should.have.property('advertisements');
      cont.should.have.property('coreLoop');
    });
  });
});
