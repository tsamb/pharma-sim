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

describe('StorageManager', function() {
  var StorageManager, sm;
  before(function(done) {
    requirejs(['models/storage-manager'], function(StorageManagerConstructor) {
      StorageManager = StorageManagerConstructor;
      done();
    });
  });

  beforeEach(function() {
    sm = new StorageManager({capacity: 100});
  })

  describe('#instantiation', function(){
    it('should create new instances of Advertisement', function(){
      sm.should.have.property('capacity');
    });
  });

  describe('#increaseCapacity', function() {
    it('increases the capacity by the given amount', function() {
      sm.increaseCapacity(100);
      sm.capacity.should.eql(200);
    });
  });

  describe('#currentCapacityLevel', function() {
    it('returns the capacity level based on the current capacity', function() {
      sm.capacity = 300;
      sm.currentCapacityLevel().should.eql(3);
    });
  });

  describe('#cashForNextCapacityLevel', function() {
    it('calulates how much money it should cost to increase the capacity', function() {
      sm.capacity = 200;
      sm.cashForNextCapacityLevel().should.eql(10000);
    });
  });
});
