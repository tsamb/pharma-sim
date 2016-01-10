define(function() {
  function Errors() {
    this.errorList = [];
  }

  Errors.prototype.printLatestError = function() {
    console.error(this.errorList[this.errorList.length - 1]);
  }

  Errors.prototype.add = function(error) {
    this.errorList.push(error);
    this.printLatestError();
  }

  return new Errors;
});
