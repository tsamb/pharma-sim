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

describe('Advertisement', function() {
  var Advertisement, ad;
  before(function(done) {
    requirejs(['models/advertisement'], function(AdvertisementConstructor) {
      Advertisement = AdvertisementConstructor;
      done();
    });
  });

  beforeEach(function() {
    ad = new Advertisement({name: "Test Ad", hype: 500, price: 1000});
  })

  describe('#instantiation', function(){
    it('should create new instances of Advertisement', function(){
      ad.should.have.property('name', "Test Ad");
      ad.should.have.property('hype', 500);
      ad.should.have.property('price', 1000);
      ad.should.have.property('id');
    });

    it('should have an id starting with "advertisement-"', function() {
      ad.id.should.match(/advertisement-.*/);
    });
  });
});
