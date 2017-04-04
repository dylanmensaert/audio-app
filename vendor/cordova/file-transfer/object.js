/*global XMLHttpRequest, Blob*/

(function() {
    define('file-transfer', ['ember'], function(Ember) {
        'use strict';

        Ember = Ember.default;

        // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
        return {
            'default': {
                download: function(track, type) {
                    var source = track.buildFilePath(type),
                        name = Ember.String.capitalize(type),
                        url = track.get('online' + name);

                    return new Ember.RSVP.Promise(function(resolve, reject) {
                        var xhr = new XMLHttpRequest();

                        xhr.open('GET', url, true);
                        xhr.responseType = 'arraybuffer';

                        xhr.onload = function() {
                            var response = this.response;

                            track.get('fileSystem.instance').root.getFile(source, {
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
