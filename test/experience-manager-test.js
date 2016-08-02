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
  var ExperienceManager, em;
  before(function(done) {
    requirejs(['models/experience-manager'], function(ExperienceManagerConstructor) {
      ExperienceManager = ExperienceManagerConstructor;
      done();
    });
  });

  beforeEach(function(done) {
    em = new ExperienceManager;
    done();
  })

  describe('#instantiation', function(){
    it('should create new instances of ExperienceManager with experience of 0', function(){
      em.should.have.property('experience', 0);
    });
  });

  describe('#level', function() {
    it('should start at level 1', function() {
      em.level().should.eql(1);
    });

    it('should be level 1 until 1000 xp', function() {
      em.experience = 500;
      em.level().should.eql(1);
      em.experience = 1000;
      em.level().should.eql(1);
    });

    it('should be level 2 between 1001 and 8000 xp', function() {
      em.experience = 1001;
      em.level().should.eql(2);
      em.experience = 8000;
      em.level().should.eql(2);
    });

    it('should be level 3 between 8001 and 27000 xp', function() {
      em.experience = 8001;
      em.level().should.eql(3);
      em.experience = 27000;
      em.level().should.eql(3);
    });

    it('should be level 4 between 27001 and 64000 xp', function() {
      em.experience = 27001;
      em.level().should.eql(4);
      em.experience = 64000;
      em.level().should.eql(4);
    });

    it('should be level 5 between 64001 and 125000 xp', function() {
      em.experience = 64001;
      em.level().should.eql(5);
      em.experience = 125000;
      em.level().should.eql(5);
    });
  });

  describe('#currentLevelReachedAt', function() {
    it('calculates the amount of experience the current level was reached at', function() {
      em.currentLevelReachedAt().should.eql(0);
    });

    it('should be 0 until 1000', function() {
      em.experience = 1000;
      em.currentLevelReachedAt().should.eql(0);
    });

    it('should be 1000 until 8000', function() {
      em.experience = 1001;
      em.currentLevelReachedAt().should.eql(1000);
      em.experience = 8000;
      em.currentLevelReachedAt().should.eql(1000);
    });

    it('should work for all levels', function() {
      em.experience = 112000;
      em.currentLevelReachedAt().should.eql(64000);
    });
  });

  describe('#nextLevelReachedAt', function() {

  });

  describe('#experienceGainedThisLevel', function() {

  });

  describe('#experienceRemainingThisLevel', function() {

  });

  describe('#experienceBetweenCurrentLevels', function() {

  });

  describe('#percentageOfCurrentLevelComplete', function() {

  });

  describe('#increase', function() {

  });

});
