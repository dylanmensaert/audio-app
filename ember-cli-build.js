/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app'),
    Funnel = require('broccoli-funnel'),
    extraAssets = [];

extraAssets.push(new Funnel('bower_components/material-design-icons/iconfont', {
    srcDir: '/',
    destDir: '/assets/fonts'
}));

extraAssets.push(new Funnel('vendor/fonts', {
    srcDir: '/',
    destDir: '/assets/fonts'
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

    app.import('bower_components/material-design-lite/material.css');
    app.import('vendor/styles/mdl.css');

    app.import('bower_components/material-design-lite/material.js');

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

    app.import({
        development: 'vendor/network/connection.js',
        production: 'vendor/network/connection.prod.js'
    }, {
        exports: 'connection'
    });

    app.import('vendor/phonegap.js');

    return app.toTree(extraAssets);
};
