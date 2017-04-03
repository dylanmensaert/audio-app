/*global FileTransfer*/

(function() {
    define('file-transfer', ['ember', 'cordova'], function(Ember, cordova) {
        'use strict';

        Ember = Ember.default;
        cordova = cordova.default;

        var fileTransfer = {};

        cordova.onDeviceReady.then(function() {
            fileTransfer.download = function(track, type) {
                return new Ember.RSVP.Promise(function(resolve, reject) {
                    let fileSystem = track.get('fileSystem'),
                        cdvPath = track.buildFilePath(type);

                    fileSystem.get('instance').root.getFile(cdvPath, {
                        create: true,
                        exclusive: false
                    }, function(fileEntry) {
                        let fileTransfer = new FileTransfer(),
                            source = fileEntry.toURL(),
                            name = Ember.String.capitalize(type);

                        fileTransfer.download(track.get('online' + name), source, function() {
                            track.set('offline' + name, source);

                            resolve();
                        }, reject);
                    }, reject);
                });
            };
        });

        return {
            'default': fileTransfer
        };
    });
})();
