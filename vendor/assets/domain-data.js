(function() {
    define('domain-data', [], function() {
        'use strict';

        var hostName = 'http://localhost:4200';

        return {
            'default': {
                downloadName: hostName,
                suggestName: hostName,
                searchName: hostName,
                imageName: hostName,
                fileSystemName: 'filesystem:' + hostName + '/persistent'
            }
        };
    });
})();
