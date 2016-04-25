define(function() {
  function DaysPresenter(object) {
    this.element = document.getElementById("day-count");
    this.object = object;
    this.init();
  }

  DaysPresenter.prototype.init = function() {
    this.refresh();
  }

  DaysPresenter.prototype.refresh = function() {
    this.element.innerText = this.object.count;
  }

  return DaysPresenter;
});
