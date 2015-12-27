(function() {
    define('domain-data', [], function() {
        'use strict';

        const hostName = 'http://localhost:4200';

        return {
            'default': {
                downloadName: hostName,
                suggestName: hostName,
                searchName: hostName,
                imageName: hostName
            }
        };
    });
})();
