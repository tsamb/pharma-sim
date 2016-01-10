define(['presenters/days-presenter'], function(DaysPresenter) {
  function Days() {
    this.count = 1;
    this.presenter = new DaysPresenter(this);
  }

  Days.prototype.increment = function() {
    this.count++;
    this.presenter.refresh();
  }

  return Days;
})
