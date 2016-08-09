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

describe('SupplyOffer', function() {
  var SupplyOffer, so;
  before(function(done) {
    requirejs(['models/supply-offer'], function(SupplyOfferConstructor) {
      SupplyOffer = SupplyOfferConstructor;
      done();
    });
  });

  beforeEach(function() {
    so = new SupplyOffer({amount: 500, price: 30000});
  });

  describe('#instantiation', function(){
    it('should create new instances of Days with a count starting at 1', function(){
      so.should.have.property('amount', 500);
      so.should.have.property('price', 30000);
    });

    it('should have an id starting with "supplyoffer-"', function() {
      so.id.should.match(/supplyoffer-.*/);
    });
  });
});
