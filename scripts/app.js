requirejs.config({
    baseUrl: 'scripts',
    paths: {
        models: './models',
        presenters: './presenters',
        errors: './errors'
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
  new Controller;
});
