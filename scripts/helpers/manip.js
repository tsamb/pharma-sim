define(function() {
  var Manip = {};

  Manip.removeClassFrom = function(els, klass) {
    [].forEach.call(els, function(el) {
        el.classList.remove(klass);
    });
  }

  Manip.addClassTo = function(el, klass) {
    el.classList.add(klass);
  }

  return Manip;
})
