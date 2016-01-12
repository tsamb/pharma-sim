define(function() {
  function HeadquartersPresenter(object) {
    this.parentContainer = document.getElementById("hq");
    this.object = object;
    this.init();
  }

  HeadquartersPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  HeadquartersPresenter.prototype.refresh = function() {
    document.getElementById("hq").getElementsByClassName("capacity-cash")[0].innerText = this.object.cashForNextCapacityLevel();
    document.getElementById("hq").getElementsByClassName("level-for-capacity")[0].innerText = this.object.currentCapacityLevel() + 1;
  }

  HeadquartersPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<table>" +
    "<tr><td>Upgrade your storage:</td><td>$<span class='capacity-cash'>" + this.object.cashForNextCapacityLevel() + "</span> (level <span class='level-for-capacity'>" + (this.object.currentCapacityLevel() + 1) + "</span> required)</td><td><button>Buy more storage space</button></td></tr>" +
    "</table>";
    return wrapper.firstChild;
  }

  return HeadquartersPresenter;
});
