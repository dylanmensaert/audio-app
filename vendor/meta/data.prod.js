(function() {
  define('meta-data', ['secret'], function(secret) {
    'use strict';

    var data = {
      downloadHost: 'http://www.youtube-mp3.org',
      suggestHost: 'http://suggestqueries.google.com',
      searchHost: 'https://www.googleapis.com',
      imageHost: 'https://i.ytimg.com',
      key: secret.key
    };

    return {
      'default': data
    };
  });
})();
