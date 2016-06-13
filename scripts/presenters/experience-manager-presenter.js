define(function() {
  function ExperienceManagerPresenter(object) {
    this.parentContainer = document.getElementById("experience");
    this.object = object;
    this.init();
  }

  ExperienceManagerPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  ExperienceManagerPresenter.prototype.refresh = function() {
    this.parentContainer.getElementsByClassName("level")[0].innerText = this.object.level();
    this.parentContainer.getElementsByClassName("level-progress")[0].value = this.object.percentageOfCurrentLevelComplete();
  }

  ExperienceManagerPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<table>" +
                        "<tr><td>Current level:</td><td class='level'>" + this.object.level() + "</td></tr>" +
                        "<tr><td>Next level progress:</td><td><progress class='level-progress' max='100' value='" + this.object.percentageOfCurrentLevelComplete() + "'></progress></td></tr>" +
                        "</table>";
    return wrapper.firstChild;
  }

  return ExperienceManagerPresenter;
})
