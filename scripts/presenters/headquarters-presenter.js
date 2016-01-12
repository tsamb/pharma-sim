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

  }

  HeadquartersPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<button>Buy more storage space</button>";
    return wrapper.firstChild;
  }

  return HeadquartersPresenter;
});
