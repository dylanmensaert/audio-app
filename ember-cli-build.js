/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    Funnel = require('broccoli-funnel'),
    extraAssets = [];

extraAssets.push(new Funnel('bower_components/material-design-icons/iconfont', {
    srcDir: '/',
    destDir: '/assets'
}));

extraAssets.push(new Funnel('bower_components/materialize/fonts/roboto', {
    srcDir: '/',
    destDir: '/fonts/roboto'
}));

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Add options here
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.
    //
    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    app.import('bower_components/materialize/bin/materialize.css');
    app.import('bower_components/materialize/bin/materialize.js');

    app.import('bower_components/material-design-icons/iconfont/material-icons.css');

    app.import('bower_components/materialize/extras/noUiSlider/nouislider.css');
    app.import('bower_components/nouislider/distribute/nouislider.js');

    // TODO: dont export moment.js as global
    app.import('bower_components/moment/moment.js');

    // TODO: check to move from /vendor to /app?
    // TODO: implement
    app.import('vendor/assets/api-key.js');
    app.import({
        development: 'vendor/assets/domain-data.js',
        production: 'vendor/assets/domain-data.prod.js'
    }, {
        exports: 'domain-data'
    });

    app.import('vendor/network/connection-mixin.js');

    app.import({
        development: 'vendor/network/connection.js',
        production: 'vendor/network/connection.prod.js'
    }, {
        exports: 'connection'
    });

    app.import({
        development: 'vendor/phonegap.js',
        production: 'vendor/phonegap.prod.js'
    }, {
        exports: 'phonegap'
    });

    return app.toTree(extraAssets);
};
