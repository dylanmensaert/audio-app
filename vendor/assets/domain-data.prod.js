(function() {
    define('domain-data', [], function() {
        'use strict';

        return {
            'default': {
                downloadName: 'http://www.youtube-mp3.org',
                suggestName: 'http://suggestqueries.google.com',
                searchName: 'https://www.googleapis.com',
                imageName: 'https://i.ytimg.com',
                fileSystemName: 'cdvfile://localhost/persistent'
            }
        };
    });
})();
