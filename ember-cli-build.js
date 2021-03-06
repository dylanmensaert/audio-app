/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

var Funnel = require('broccoli-funnel'),
    extraAssets = [];

extraAssets.push(new Funnel('bower_components/mdi/fonts', {
    srcDir: '/',
    destDir: '/fonts'
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

    app.import('bower_components/material-refresh/build/css/material-refresh.css');
    app.import('bower_components/material-refresh/build/js/material-refresh.js');

    app.import('bower_components/hammerjs/hammer.js');

    app.import('bower_components/materialize/dist/css/materialize.css');
    app.import('bower_components/materialize/dist/js/materialize.js');

    app.import('bower_components/mdi/css/materialdesignicons.css');

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

    app.import('vendor/cordova/network-information/mixin.js');

    app.import({
        development: 'vendor/cordova/network-information/network-information.js',
        production: 'vendor/cordova/network-information/network-information.prod.js'
    }, {
        exports: 'connection'
    });

    app.import({
        development: 'vendor/cordova/music-controls/music-controls.js',
        production: 'vendor/cordova/music-controls/music-controls.prod.js'
    }, {
        exports: 'music-controls'
    });

    app.import({
        development: 'vendor/cordova/cordova.js',
        production: 'vendor/cordova/cordova.prod.js'
    }, {
        exports: 'cordova'
    });

    app.import({
        development: 'vendor/cordova/file-transfer/file-transfer.js',
        production: 'vendor/cordova/file-transfer/file-transfer.prod.js'
    }, {
        exports: 'file-transfer'
    });

    app.import('vendor/cordova/media/media.prod.js');

    return app.toTree(extraAssets);
};
