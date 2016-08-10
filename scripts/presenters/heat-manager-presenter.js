define(function() {
  function HeatManagerPresenter(object) {
    this.parentContainer = document.getElementById("heat-meter-container");
    this.object = object;
    this.init();
  }

  HeatManagerPresenter.prototype.init = function() {
    this.refresh();
  }

  HeatManagerPresenter.prototype.refresh = function() {
    this.parentContainer.getElementsByClassName("level")[0].innerText = this.object.level();
    this.parentContainer.getElementsByClassName("level-progress")[0].value = this.object.percentageOfCurrentLevelComplete();
  }

  return HeatManagerPresenter;
});
