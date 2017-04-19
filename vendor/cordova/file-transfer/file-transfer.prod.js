/*global FileTransfer*/

(function() {
    define('file-transfer', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': {
                download: function(track, type) {
                    return new Ember.RSVP.Promise(function(resolve, reject) {
                        var fileSystem = track.get('fileSystem'),
                            cdvPath = track.buildFilePath(type);

                        fileSystem.get('instance').root.getFile(cdvPath, {
                            create: true,
                            exclusive: false
                        }, function(fileEntry) {
                            var fileTransfer = new FileTransfer(),
                                source = fileEntry.toURL(),
                                name = Ember.String.capitalize(type);

                            fileTransfer.download(track.get('online' + name), source, function() {
                                track.set('offline' + name, source);

                                resolve();
                            }, reject);
                        }, reject);
                    });
                }
            }
        };
    });
})();
