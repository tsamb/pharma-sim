define(['presenters/experience-manager-presenter'], function(ExperienceManagerPresenter) {
  var LEVEL_MULTIPLE = 10;
  var LEVEL_EXPONENT = 3;

  function ExperienceManager() {
    this.experience = 0;
    this.presenter = new ExperienceManagerPresenter(this);
  }

  // <<<<<<<< COMPUTED PROPERTIES >>>>>>>>

  ExperienceManager.prototype.level = function() {
    // current xp/level: 2 => 1000, 3 => 8000, 4 => 27000, 5 => 125000
    return Math.floor(Math.pow(this.experience, 1 / LEVEL_EXPONENT) / LEVEL_MULTIPLE) + 1;
  }

  ExperienceManager.prototype.currentLevelReachedAt = function() {
    return Math.pow(((this.level() - 1) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  ExperienceManager.prototype.nextLevelReachedAt = function() {
    return Math.pow(((this.level()) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  ExperienceManager.prototype.experienceGainedThisLevel = function() {
    return this.experience - this.currentLevelReachedAt();
  }

  ExperienceManager.prototype.experienceRemainingThisLevel = function() {
    return this.nextLevelReachedAt() - this.experience;
  }

  ExperienceManager.prototype.experienceBetweenCurrentLevels = function() {
    return this.nextLevelReachedAt() - this.currentLevelReachedAt();
  }

  ExperienceManager.prototype.percentageOfCurrentLevelComplete = function() {
    return Math.floor((this.experienceGainedThisLevel() / this.experienceBetweenCurrentLevels()) * 100);
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  ExperienceManager.prototype.increase = function(amount) {
    this.experience += amount;
    this.presenter.refresh();
  }

  return ExperienceManager;
})
