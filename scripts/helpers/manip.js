define(function() {
  var Manip = {};

  Manip.removeClassFrom = function(el, class) {
    var els = document.querySelectorAll(selector);
    [].forEach.call(els, function(el) {
        el.classList.remove("active");
    });
  }

  Manip.addClassTo = function(el) {
    el.classList.add("active");
  }

  return Manip;
})
