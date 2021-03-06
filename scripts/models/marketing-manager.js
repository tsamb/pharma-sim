define(['presenters/marketing-manager-presenter'], function(MarketingManagerPresenter) {
  var LEVEL_MULTIPLE = 10;
  var LEVEL_EXPONENT = 3;
  var FADE_DECREMENT_MULTIPLE = 0.01;

  function MarketingManager() {
    this.hype = 0;
    this.presenter = new MarketingManagerPresenter(this);
  }

  // <<<<<<<< COMPUTED PROPERTIES >>>>>>>>

  MarketingManager.prototype.level = function() {
    // current xp/level: 2 => 1000, 3 => 8000, 4 => 27000, 5 => 64000, 6 => 125000
    return Math.floor(Math.pow(this.hype + 1, 1 / LEVEL_EXPONENT) / LEVEL_MULTIPLE) + 1;
  }

  MarketingManager.prototype.currentLevelReachedAt = function() {
    return Math.pow(((this.level() - 1) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  MarketingManager.prototype.nextLevelReachedAt = function() {
    return Math.pow(((this.level()) * LEVEL_MULTIPLE), LEVEL_EXPONENT);
  }

  MarketingManager.prototype.hypeGainedThisLevel = function() {
    return this.hype - this.currentLevelReachedAt();
  }

  MarketingManager.prototype.hypeRemainingThisLevel = function() {
    return this.nextLevelReachedAt() - this.hype;
  }

  MarketingManager.prototype.hypeBetweenCurrentLevels = function() {
    return this.nextLevelReachedAt() - this.currentLevelReachedAt();
  }

  MarketingManager.prototype.percentageOfCurrentLevelComplete = function() {
    return Math.floor((this.hypeGainedThisLevel() / this.hypeBetweenCurrentLevels()) * 100);
  }

  // <<<<<<<< MUTATOR METHODS >>>>>>>>

  MarketingManager.prototype.increaseHype = function(amount) {
    this.hype += amount;
    this.presenter.refresh();
  }

  MarketingManager.prototype.decreaseHype = function(amount) {
    var amountToDecrease = Math.ceil(amount);
    if (amountToDecrease > this.hype) {
      this.hype = 0;
    } else {
      this.hype -= Math.ceil(amount);
      this.presenter.refresh();
    }
  }

  MarketingManager.prototype.organicHypeFade = function() {
    this.decreaseHype(FADE_DECREMENT_MULTIPLE * this.hype);
  }

  return new MarketingManager;
})
