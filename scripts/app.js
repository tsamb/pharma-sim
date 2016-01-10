requirejs.config({
    baseUrl: 'scripts',
    paths: {
        models: './models',
        presenters: './presenters'
    }
});

requirejs(["controller"], function(Controller) {
  new Controller;
});
