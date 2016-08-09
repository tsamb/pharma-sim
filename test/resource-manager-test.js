var requirejs = require("requirejs");
var should = require("should");
var sinon = require("sinon");

// Rudimentary Browser API Audio constructor stub.
// Must be globally scoped like this to work.
// Should refactor all audio calls into a module for easier stubbing.
Audio = function() {
  this.play = function() {};
}

requirejs.config({
  baseUrl: 'scripts',
  paths: {
    models: 'models',
    presenters: '../test/mocks/presenters',
    errors: '../test/mocks/errors'
  }
});

describe('ResourceManager', function() {
  var ResourceManager, errors, rm;
  before(function(done) {
    requirejs(['models/resource-manager','errors/errors'], function(ResourceManagerConstructor, errorsStub) {
      ResourceManager = ResourceManagerConstructor;
      errors = errorsStub;
      done();
    });
  });

  beforeEach(function(done) {
    rm = new ResourceManager;
    done();
  });

  describe('#instantiation', function() {
    it('should create new instances of ResourceManager with the correct properties', function(){
      rm.should.have.property('product', 0);
      rm.should.have.property('bankAccount');
      rm.should.have.property('storageManager');
      rm.should.have.property('experienceManager');
    });
  });

  describe('#productIsAvailable', function() {
    it('returns true if there is product available', function() {
      rm.product = 5;
      rm.productIsAvailable().should.equal(true);
    });

    it('returns false if there is no product', function() {
      rm.product = 0;
      rm.productIsAvailable().should.equal(false);
    });
  });

  describe('#cashIsAvailable', function() {
    it('returns true if there is at least as much cash available as input', function() {
      rm.bankAccount = 500;
      rm.cashIsAvailable(100).should.equal(true);
      rm.cashIsAvailable(500).should.equal(true);
    });

    it('returns false if there is less cash available than the input', function() {
      rm.bankAccount = 300;
      rm.cashIsAvailable(500).should.equal(false);
      rm.cashIsAvailable(301).should.equal(false);
    });
  });

  describe('#capacityIsAvailable', function() {
    it('returns true if there is sufficient space to store the input amount', function() {
      rm.product = 50;
      rm.storageManager.capacity = 100;
      rm.capacityIsAvailable(10).should.equal(true);
      rm.capacityIsAvailable(50).should.equal(true);
    });

    it('returns false if there is insufficient space to store the input amount', function() {
      rm.product = 50;
      rm.storageManager.capacity = 100;
      rm.capacityIsAvailable(60).should.equal(false);
      rm.capacityIsAvailable(51).should.equal(false);
    });
  });

  describe('#processPurchase', function() {
    it('deducts the given amount from the bank balance', function() {
      rm.bankAccount = 1000;
      rm.processPurchase(600);
      rm.bankAccount.should.eql(400);
    });

    it('does not allow transactions for more than the bank balance contains', function() {
      rm.bankAccount = 1000;
      rm.processPurchase(2000);
      rm.bankAccount.should.eql(1000);
    });
  });

  describe('#sellProduct', function() {
    context('when there is product available', function() {
      it('adds to bank account and removes from product based on inputs', function() {
        var xpIncreaseSpy = sinon.spy(rm.experienceManager, 'increase');
        rm.bankAccount = 1000;
        rm.product = 10;
        rm.sellProduct(1, 500);
        rm.bankAccount.should.eql(1500);
        rm.product.should.eql(9);
        xpIncreaseSpy.called.should.eql(true, 'expected #increase to be called');
      });
    });

    context('when there is no product available', function() {
      it('does nothing', function() {
        rm.bankAccount = 1000;
        rm.product = 0;
        rm.sellProduct(1, 500);
        rm.bankAccount.should.eql(1000);
      });
    });
  });

  describe('#buyProduct', function() {
    context('when there is sufficient cash and capacity', function() {
      it('adds to product and removes from bank account based on inputs', function() {
        var xpIncreaseSpy = sinon.spy(rm.experienceManager, 'increase');
        rm.bankAccount = 1000;
        rm.product = 10;
        rm.buyProduct(20, 600);
        rm.bankAccount.should.eql(400);
        rm.product.should.eql(30);
        xpIncreaseSpy.called.should.eql(true, 'expected #increase to be called');
      });
    });

    context('when there is insufficient cash', function() {
      it('does nothing', function() {
        rm.bankAccount = 1000;
        rm.product = 10;
        rm.buyProduct(50, 5000);
        rm.bankAccount.should.eql(1000);
        rm.product.should.eql(10);
      });
    });

    context('when there is insufficient capacity', function() {
      it('does nothing', function() {
        rm.bankAccount = 1000;
        rm.product = 0;
        rm.sellProduct(1, 500);
        rm.bankAccount.should.eql(1000);
      });
    });
  });

  describe('#increaseCapacity', function() {
    context('when there is sufficient cash and xp level', function() {
      it('deducts from bank account and calls #increaseCapacity on the storageManager', function() {
        var storageIncreaseSpy = sinon.spy(rm.storageManager, 'increaseCapacity');
        var xpLevelStub = sinon.stub(rm.experienceManager, 'level', function() { return 3 });
        var capLevelStub = sinon.stub(rm.storageManager, 'currentCapacityLevel', function() { return 1 });
        rm.bankAccount = 10000;
        rm.increaseCapacity();
        storageIncreaseSpy.called.should.eql(true, 'expected #increaseCapacity to be called');
        rm.bankAccount.should.be.lessThan(10000);
      });
    });

    context('when there is insufficient cash', function() {
      it('does nothing', function() {
        var storageIncreaseSpy = sinon.spy(rm.storageManager, 'increaseCapacity');
        var xpLevelStub = sinon.stub(rm.experienceManager, 'level', function() { return 3 });
        var capLevelStub = sinon.stub(rm.storageManager, 'currentCapacityLevel', function() { return 1 });
        rm.bankAccount = 1000;
        rm.increaseCapacity();
        storageIncreaseSpy.called.should.eql(false, 'expected #increaseCapacity not to be called');
        rm.bankAccount.should.eql(1000);
      });
    });

    context('when the xp level is insufficient', function() {
      it('does nothing', function() {
        var storageIncreaseSpy = sinon.spy(rm.storageManager, 'increaseCapacity');
        var xpLevelStub = sinon.stub(rm.experienceManager, 'level', function() { return 1 });
        var capLevelStub = sinon.stub(rm.storageManager, 'currentCapacityLevel', function() { return 2 });
        var errorsSpy = sinon.spy(errors, 'add')
        rm.bankAccount = 30000;

        rm.increaseCapacity();
        storageIncreaseSpy.called.should.eql(false);
        rm.bankAccount.should.eql(30000);
        errorsSpy.called.should.eql(true, 'expected #add to be called');
      });
    });
  });
});
