define(function() {
  function ResourceManagerPresenter(object) {
    this.parentContainer = document.getElementById("resources");
    this.object = object;
    this.init();
  }

  ResourceManagerPresenter.prototype.init = function() {
    this.parentContainer.appendChild(this.html());
  }

  ResourceManagerPresenter.prototype.refresh = function() {
    document.getElementById('bank-balance').innerText = this.object.bankAccount;
    document.getElementById('product').innerText = this.object.product;
    document.getElementById('capacity').innerText = this.object.capacity;
  }

  ResourceManagerPresenter.prototype.html = function() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = "<table>" +
                        "<tr><td>Bank balance:</td><td id='bank-balance'>" + this.object.bankAccount + "</td></tr>" +
                        "<tr><td>Product / Capacity:</td><td><span id='product'>" + this.object.product + "</span> / <span id='capacity'>" + this.object.capacity + "</span></td></tr>" +
                        "</table>";
    return wrapper;
  }

  return ResourceManagerPresenter;
});
