requirejs.config({
    baseUrl: 'scripts',
    paths: {
        models: './models',
        presenters: './presenters',
        errors: './errors'
    }
});

requirejs(["controller"], function(Controller) {
  new Controller;
});
