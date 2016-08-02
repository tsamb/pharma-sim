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
      em.experience = 999;
      em.level().should.eql(1);
    });

    it('should be level 2 between 1000 and 7999 xp', function() {
      em.experience = 1000;
      em.level().should.eql(2);
      em.experience = 7999;
      em.level().should.eql(2);
    });

    it('should be level 3 between 8000 and 26999 xp', function() {
      em.experience = 8000;
      em.level().should.eql(3);
      em.experience = 26999;
      em.level().should.eql(3);
    });

    it('should be level 4 between 27000 and 63999 xp', function() {
      em.experience = 27000;
      em.level().should.eql(4);
      em.experience = 63999;
      em.level().should.eql(4);
    });

    it('should be level 5 between 64000 and 124999 xp', function() {
      em.experience = 64000;
      em.level().should.eql(5);
      em.experience = 124999;
      em.level().should.eql(5);
    });
  });

  describe('#currentLevelReachedAt', function() {
    it('calculates the amount of experience the current level was reached at', function() {
      em.currentLevelReachedAt().should.eql(0);
    });

    it('should be 0 until 1000', function() {
      em.experience = 999;
      em.currentLevelReachedAt().should.eql(0);
    });

    it('should be 1000 until 8000', function() {
      em.experience = 1000;
      em.currentLevelReachedAt().should.eql(1000);
      em.experience = 7999;
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
