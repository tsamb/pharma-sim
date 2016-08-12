define(['presenters/heat-manager-presenter'], function(HeatManagerPresenter) {
  var LEVEL_MULTIPLE = 100;
  var LEVEL_EXPONENT = 2;
  var FADE_DECREMENT_MULTIPLE = 0.1;

  function HeatManager() {
    this.heat = 0;
    this.presenter = new HeatManagerPresenter(this);
  }

  // <<<<<<<< COMPUTED PROPERTIES >>>>>>>>

  HeatManager.prototype.level = function() {
    return Math.floor(Math.pow(this.heat + 1, 1 / LEVEL_EXPONENT) / LEVEL_MULTIPLE) + 1;
  }

  HeatManager.prototype.currentLevelReachedAt = function() {
    return Math.pow(((this.level() - 1) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  HeatManager.prototype.nextLevelReachedAt = function() {
    return Math.pow(((this.level()) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  HeatManager.prototype.heatGainedThisLevel = function() {
    return this.heat - this.currentLevelReachedAt();
  }

  HeatManager.prototype.heatRemainingThisLevel = function() {
    return this.nextLevelReachedAt() - this.heat;
  }

  HeatManager.prototype.heatBetweenCurrentLevels = function() {
    return this.nextLevelReachedAt() - this.currentLevelReachedAt();
  }

  HeatManager.prototype.percentageOfCurrentLevelComplete = function() {
    return Math.floor((this.heatGainedThisLevel() / this.heatBetweenCurrentLevels()) * 100);
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  HeatManager.prototype.increaseHeat = function(amount) {
    this.heat += amount;
    this.presenter.refresh();
  }

  HeatManager.prototype.decreaseHeat = function(amount) {
    var amountToDecrease = Math.ceil(amount);
    if (amountToDecrease > this.heat) {
      this.heat = 0;
    } else {
      this.heat -= Math.ceil(amount);
      this.presenter.refresh();
    }
  }

  HeatManager.prototype.organicHeatFade = function() {
    this.decreaseHeat(FADE_DECREMENT_MULTIPLE * this.heat);
  }

  return new HeatManager;
})
