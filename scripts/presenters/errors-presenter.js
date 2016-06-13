define(function() {
  function ErrorsPresenter(object) {
    this.parentContainer = document.getElementById("messages");
    this.object = object;
  }

  ErrorsPresenter.prototype.prepend = function(error) {
    var div = document.createElement('div');
    div.innerText = error;
    this.parentContainer.insertBefore(div, this.parentContainer.firstChild);
  }

  return ErrorsPresenter;
})
