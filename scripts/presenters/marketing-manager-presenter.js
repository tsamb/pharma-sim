define(function() {
  function MarketingManagerPresenter(object) {
    this.parentContainer = document.getElementById("hype-meter-container");
    this.object = object;
    this.init();
  }

  MarketingManagerPresenter.prototype.init = function() {
    this.refresh();
  }

  MarketingManagerPresenter.prototype.refresh = function() {
    this.parentContainer.getElementsByClassName("level")[0].innerText = this.object.level();
    this.parentContainer.getElementsByClassName("level-progress")[0].value = this.object.percentageOfCurrentLevelComplete();
  }

  return MarketingManagerPresenter;
});
