define(function() {
  function SupplyOfferPresenter(object) {
    this.parentContainer = document.getElementById("supplyoffers");
    this.object = object;
    this.init();
  }

  SupplyOfferPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  SupplyOfferPresenter.prototype.refresh = function() {
    document.getElementById(this.object.id).innerHTML = "Purchase <span class='amount'>" + this.object.amount + "</span> ounces for $<span class='price'>" + this.object.price + "</span>";
  }

  SupplyOfferPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<button id='" + this.object.id + "'>Purchase <span class='amount'>" + this.object.amount + "</span> ounces for $<span class='price'>" + this.object.price + "</span></button>";
    return wrapper.firstChild;
  }

  return SupplyOfferPresenter;
})
