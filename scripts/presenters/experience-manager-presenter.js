define(function() {
  function ExperienceManagerPresenter(object) {
    this.parentContainer = document.getElementById("xp-meter-container");
    this.object = object;
    this.init();
  }

  ExperienceManagerPresenter.prototype.init = function() {
    this.refresh();
  }

  ExperienceManagerPresenter.prototype.refresh = function() {
    this.parentContainer.getElementsByClassName("level")[0].innerText = this.object.level();
    this.parentContainer.getElementsByClassName("level-progress")[0].value = this.object.percentageOfCurrentLevelComplete();
  }

  return ExperienceManagerPresenter;
});
