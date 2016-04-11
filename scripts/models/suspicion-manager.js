define(['presenters/suspicion-manager-presenter'], function(SuspicionManagerPresenter) {
  var LEVEL_MULTIPLE = 10;
  var LEVEL_EXPONENT = 3;
  var FADE_DECREMENT_MULTIPLE = 0.01;

  function SuspicionManager() {
    this.suspicion = 0;
    this.presenter = new SuspicionManagerPresenter(this);
  }

  // <<<<<<<< COMPUTED PROPERTIES >>>>>>>>

  SuspicionManager.prototype.level = function() {
    // current suspicion/level: 2 => 1000, 3 => 8000, 4 => 27000, 5 => 125000
    return Math.floor(Math.pow(this.suspicion, 1 / LEVEL_EXPONENT) / LEVEL_MULTIPLE) + 1;
  }

  SuspicionManager.prototype.currentLevelReachedAt = function() {
    return Math.pow(((this.level() - 1) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  SuspicionManager.prototype.nextLevelReachedAt = function() {
    return Math.pow(((this.level()) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  SuspicionManager.prototype.suspicionGainedThisLevel = function() {
    return this.suspicion - this.currentLevelReachedAt();
  }

  SuspicionManager.prototype.suspicionRemainingThisLevel = function() {
    return this.nextLevelReachedAt() - this.suspicion;
  }

  SuspicionManager.prototype.suspicionBetweenCurrentLevels = function() {
    return this.nextLevelReachedAt() - this.currentLevelReachedAt();
  }

  SuspicionManager.prototype.percentageOfCurrentLevelComplete = function() {
    return Math.floor((this.suspicionGainedThisLevel() / this.suspicionBetweenCurrentLevels()) * 100);
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  SuspicionManager.prototype.increaseSuspicion = function(amount) {
    this.suspicion += amount;
    this.presenter.refresh();
  }

  SuspicionManager.prototype.decreaseSuspicion = function(amount) {
    this.suspicion -= Math.ceil(amount);
    this.presenter.refresh();
  }

  SuspicionManager.prototype.organicSuspicionFade = function() {
    if (this.suspicion > 0 + (FADE_DECREMENT_MULTIPLE * this.suspicion)) {
      this.decreaseSuspicion(FADE_DECREMENT_MULTIPLE * this.suspicion);
    } else {
      this.suspicion = 0;
    }
  }

  return new SuspicionManager;
})
