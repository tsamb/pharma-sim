define(function() {
  function ResourceManagerPresenter(object) {
    this.parentContainer = document.getElementById("stock");
    this.object = object;
    this.refresh();
  }

  ResourceManagerPresenter.prototype.refresh = function() {
    document.getElementById('bank-balance').innerText = "$" + this.object.bankAccount;
    document.getElementById('product').innerText = this.object.product;
    document.getElementById('capacity').innerText = this.object.storageManager.capacity; // move into HQ/storageManager presenter ???
  }

  return ResourceManagerPresenter;
});
