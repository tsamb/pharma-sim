define(function() {
  function MarketingMethodPresenter(object) {
    this.parentContainer = document.getElementById("marketing-methods");
    this.object = object;
    this.init();
  }

  MarketingMethodPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  MarketingMethodPresenter.prototype.refresh = function() {
    document.getElementById(this.object.id).innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='name'>" + this.object.name + "</span> for $<span class='price'>" + this.object.price + "</span></button>";
  }

  MarketingMethodPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='name'>" + this.object.name + "</span> for $<span class='price'>" + this.object.price + "</span></button>";
    return wrapper.firstChild;
  }

  return MarketingMethodPresenter;
})
