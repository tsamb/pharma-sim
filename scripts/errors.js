define(['presenters/errors-presenter'], function(ErrorsPresenter) {
  function Errors() {
    this.errorList = [];
    this.presenter = new ErrorsPresenter(this);
  }

  Errors.prototype.printLatestError = function() {
    console.error(this.latestError());
    this.presenter.prepend(this.latestError());
  }

  Errors.prototype.latestError = function() {
    return this.errorList[this.errorList.length - 1];
  }

  Errors.prototype.add = function(error) {
    this.errorList.push(error);
    this.printLatestError();
  }

  return new Errors;
});
