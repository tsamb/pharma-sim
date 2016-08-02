define(function() {
  function AdvertisementPresenter(object) {
    this.parentContainer = document.getElementById("advertising");
    this.object = object;
    this.init();
  }

  AdvertisementPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  AdvertisementPresenter.prototype.refresh = function() {
    document.getElementById(this.object.id).innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='name'>" + this.object.name + "</span> for $<span class='price'>" + this.object.price + "</span></button>";
  }

  AdvertisementPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='name'>" + this.object.name + "</span> for $<span class='price'>" + this.object.price + "</span></button>";
    return wrapper.firstChild;
  }

  return AdvertisementPresenter;
})
