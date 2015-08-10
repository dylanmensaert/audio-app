/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    vendorFiles: {
     'ember-data.js': false
    }
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

  app.import('bower_components/material-design-icons/MaterialIcons-Regular.eot');
  app.import('bower_components/material-design-icons/MaterialIcons-Regular.ttf');
  app.import('bower_components/material-design-icons/MaterialIcons-Regular.woff');
  app.import('bower_components/material-design-icons/MaterialIcons-Regular.woff2');

  app.import('bower_components/material-design-lite/material.css');
  app.import('bower_components/material-design-lite/material.js');

  app.import('bower_components/moment/moment.js', {
    exports: 'moment'
  });

  // TODO: implement dependencies correctly
  app.import('bower_components/jquery-mobile/js/jquery.mobile.vmouse.js');
  app.import('bower_components/jquery-mobile/js/jquery.mobile.ns.js');
  app.import('bower_components/jquery-mobile/js/jquery.mobile.support.touch.js', {
    exports: 'jQuery'
  });
  app.import('bower_components/jquery-mobile/js/events/touch.js', {
    exports: 'jQuery'
  });
  app.import('bower_components/typeahead.js/dist/typeahead.jquery.js', {
    exports: 'jQuery'
  });

  // TODO: check to move from /vendor to /app?
  // TODO: implement
  app.import('vendor/meta/secret.js');
  app.import({
    development: 'vendor/meta/data.js',
    production: 'vendor/meta/data.prod.js'
  }, {
    exports: 'meta-data'
  });

  return app.toTree();
};
