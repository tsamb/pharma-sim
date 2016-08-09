requirejs.config({
    baseUrl: 'scripts',
    paths: {
        models: './models',
        presenters: './presenters',
        errors: './errors',
        helpers: './helpers'
    }
});

requirejs.onError = function (err) {
  if (err.requireType === 'timeout') {
    alert("error: "+err);
  } else {
    throw err;
  }
};

requirejs(["controller"], function(Controller) {
  var cont = new Controller();
  cont.init();
  cont.start();
});
