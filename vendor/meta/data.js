(function() {
  define('meta-data', ['secret'], function(secret) {
    'use strict';

    var host = 'http://localhost:4200',
        data;

    data = {
        downloadHost: host,
        suggestHost: host,
        searchHost: host,
        imageHost: host,
        key: secret.key
      };

    return {
      'default': data
    };
  });
})();
