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

describe('ExperienceManager', function() {
  var ExperienceManager;
  before(function(done) {
    requirejs(['models/experience-manager'], function(ExperienceManagerConstructor) {
      ExperienceManager = ExperienceManagerConstructor;
      done();
    });
  });

  describe('#instantiation', function(){
    it('should create new instances of ExperienceManager with experience of 0', function(){
      var em = new ExperienceManager;
      em.should.have.property('experience', 0);
    });
  });

  describe('#level', function() {
    var em;
    beforeEach(function(done) {
      em = new ExperienceManager;
      done();
    })

    it('should start at level 1', function() {
      em.level().should.eql(1);
    });
});
