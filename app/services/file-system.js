/* global window, Blob, FileReader, PERSISTENT, Number, requestFileSystem */

import Ember from 'ember';

var lastWriter;
// TODO: implement correctly
/*import Collection from 'audio-app/collection/model';
import Track from 'audio-app/track/model';*/

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function write(resolve) {
    var json = this.serialize();

    this.get('instance').root.getFile('data.json', {}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function() {
                if (!fileWriter.length) {
                    fileWriter.write(new Blob([json], {
                        type: 'application/json'
                    }));
                }

                resolve();
            };

            fileWriter.truncate(0);
        });
    });
}

export default Ember.Service.extend({
    store: Ember.inject.service(),
    instance: null,
    collectionIds: [],
    trackIds: [],
    playingTrackId: null,
    setDownloadedOnlyOnMobile: true,
    setDownloadLaterOnMobile: true,
    setDownloadBeforePlaying: false,
    // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
    forge: function() {
        return new Ember.RSVP.Promise(function(resolve) {
            navigator.webkitPersistentStorage.queryUsageAndQuota(function(usage, quota) {
                if (quota > usage) {
                    this.create(quota).then(function(instance) {
                        this.createFiles(instance).then(resolve);
                    }.bind(this));
                } else {
                    this.increaseQuota().then(function(instance) {
                        this.createFiles(instance).then(resolve);
                    }.bind(this));
                }
            }.bind(this));
        }.bind(this));
    },
    increaseQuota: function() {
        return new Ember.RSVP.Promise(function(resolve) {
            navigator.webkitPersistentStorage.requestQuota(Number.MAX_SAFE_INTEGER, function(bytes) {
                this.create(bytes).then(resolve);
            }.bind(this));
        }.bind(this));
    },
    create: function(bytes) {
        return new Ember.RSVP.Promise(function(resolve) {
            requestFileSystem(PERSISTENT, bytes, function(fileSystem) {
                this.set('instance', fileSystem);

                resolve(fileSystem);
            }.bind(this));
        }.bind(this));
    },
    remove: function(source) {
        return new Ember.RSVP.Promise(function(resolve) {
            this.get('instance').root.getFile(source, {}, function(fileEntry) {
                fileEntry.remove(function() {
                    resolve();
                });
            });
        }.bind(this));
    },
    createFiles: function(instance) {
        var deserialize = this.deserialize.bind(this);

        return new Ember.RSVP.Promise(function(resolve) {
            instance.root.getDirectory('thumbnails', {
                create: true
            });

            instance.root.getDirectory('audio', {
                create: true
            });

            instance.root.getFile('data.json', {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function() {
                        deserialize(this.result);

                        resolve();
                    };

                    reader.readAsText(file);
                });
            }, function() {
                instance.root.getFile('data.json', {
                    create: true
                }, function() {
                    deserialize(JSON.stringify({
                        tracks: [],
                        collections: [{
                            id: 'download-later',
                            name: 'Download later',
                            permission: 'push-only'
                        }, {
                            id: 'queue',
                            name: 'Queue',
                            permission: 'push-only'
                        }, {
                            id: 'history',
                            name: 'History',
                            permission: 'read-only'
                        }]
                    }));

                    this.write().then(resolve);
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    write: function() {
        Ember.run.cancel(lastWriter);

        return new Ember.RSVP.Promise(function(resolve) {
            lastWriter = Ember.run.later(this, write, resolve, 100);
        }.bind(this));
    },
    deserialize: function(json) {
        var store = this.get('store'),
            parsedJSON = JSON.parse(json);

        parsedJSON.collectionIds = parsedJSON.collections.map(function(collection) {
            var id = collection.id;

            delete collection.id;

            store.push({
                data: {
                    type: 'collection',
                    id: id,
                    attributes: collection
                }
            });

            return id;
        });

        delete parsedJSON.collections;

        parsedJSON.trackIds = parsedJSON.tracks.map(function(track) {
            var id = track.id;

            delete track.id;

            store.push({
                data: {
                    type: 'track',
                    id: id,
                    attributes: track
                }
            });

            return id;
        });

        delete parsedJSON.tracks;

        this.setProperties(parsedJSON);
    },
    serialize: function() {
        var store = this.get('store'),
            data = {
                playingTrackId: this.get('playingTrackId')
            };

        data.collections = this.get('collectionIds').map(function(id) {
            return store.peekRecord('collection', id).serialize();
        });

        data.tracks = this.get('trackIds').map(function(id) {
            return store.peekRecord('track', id).serialize();
        });

        return JSON.stringify(data);
    }
});
