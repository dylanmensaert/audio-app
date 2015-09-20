/* global window, Blob, FileReader, PERSISTENT, Number, requestFileSystem */

import Ember from 'ember';
// TODO: implement correctly
/*import Album from 'audio-app/album/model';
import Recording from 'audio-app/recording/model';*/

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

export default Ember.Service.extend({
    store: Ember.inject.service(),
    instance: null,
    albumIds: [],
    recordingsIds: [],
    playingRecordingId: null,
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
                        recordings: [],
                        albums: [{
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

                    this.write();

                    resolve();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    write: function() {
        var json = this.serialize();

        this.get('instance').root.getFile('data.json', {}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function() {
                    if (!fileWriter.length) {
                        fileWriter.write(new Blob([json], {
                            type: 'application/json'
                        }));
                    }
                };

                fileWriter.truncate(0);
            });
        });
    },
    deserialize: function(json) {
        var store = this.get('store'),
            parsedJSON = JSON.parse(json);

        parsedJSON.albumIds = parsedJSON.albums.map(function(album) {
            var id = album.id;

            delete album.id;

            store.push({
                data: {
                    type: 'album',
                    id: id,
                    attributes: album
                }
            });

            return id;
        });

        delete parsedJSON.albums;

        parsedJSON.recordingIds = parsedJSON.recordings.map(function(recording) {
            var id = recording.id;

            delete recording.id;

            store.push({
                data: {
                    type: 'recording',
                    id: id,
                    attributes: recording
                }
            });

            return id;
        });

        delete parsedJSON.recordings;

        this.setProperties(parsedJSON);
    },
    serialize: function() {
        var store = this.get('store'),
            data = {
                playingRecordingId: this.get('playingRecordingId')
            };

        data.albums = this.get('albumIds').map(function(id) {
            return store.peekRecord('album', id).serialize();
        });

        data.recordings = this.get('recordingIds').map(function(id) {
            return store.peekRecord('recording', id).serialize();
        });

        return JSON.stringify(data);
    }
});
