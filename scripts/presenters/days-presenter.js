define(function() {
  function DaysPresenter(object) {
    this.parentContainer = document.getElementById("days");
    this.object = object;
    this.init();
  }

  DaysPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  DaysPresenter.prototype.refresh = function() {
    this.parentContainer.getElementsByClassName("count")[0].innerText = this.object.count;
  }

  DaysPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<table>" +
                        "<tr><td>Day:</td><td class='count'>" + this.object.count + "</td></tr>" +
                        "</table>";
    return wrapper.firstChild;
  }

  return DaysPresenter;
});
