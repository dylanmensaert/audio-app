/*global XMLHttpRequest, Blob*/

(function() {
    define('file-transfer', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        return {
            'default': {
                download: function(track, type) {
                    let source = track.buildFilePath(type),
                        name = Ember.String.capitalize(type),
                        url = track.get('online' + name),
                        fileSystem = track.get('fileSystem'),
                        track = track;

                    return new Ember.RSVP.Promise(function(resolve, reject) {
                        let xhr = new XMLHttpRequest();

                        xhr.open('GET', url, true);
                        xhr.responseType = 'arraybuffer';

                        xhr.onload = function() {
                            let response = this.response;

                            fileSystem.get('instance').root.getFile(source, {
                                create: true
                            }, function(fileEntry) {
                                fileEntry.createWriter(function(fileWriter) {
                                    fileWriter.onwriteend = function() {
                                        track.set('offline' + name, fileEntry.toURL());

                                        resolve();
                                    };

                                    fileWriter.write(new Blob([response]));
                                });
                            }, reject);
                        };

                        xhr.send();
                    });
                }
            }
        };
    });
})();
