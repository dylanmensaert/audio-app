/* global window, FileReader, PERSISTENT, Number, requestFileSystem */

import Ember from 'ember';
// TODO: implement correctly
/*import Album from 'audio-app/album/model';
import Recording from 'audio-app/recording/model';*/

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

export default Ember.Service.extend({
    store: Ember.inject.service(),
    init: function() {
        this._super();

        this.forge();
    },
    instance: null,
    albumsIds: [],
    recordingsIds: [],
    playingRecordingId: null,
    setDownloadedOnlyOnMobile: true,
    setDownloadLaterOnMobile: true,
    setDownloadBeforePlaying: false,
    didParseJSON: null,
    // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
    forge: function() {
        navigator.webkitPersistentStorage.queryUsageAndQuota(function(usage, quota) {
            if (quota > usage) {
                this.create(quota).then(this.createFiles.bind(this));
            } else {
                this.increaseQuota().then(this.createFiles.bind(this));
            }
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

        instance.root.getFile('data.json', {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function() {
                    deserialize(this.result);
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
            });
        });

        instance.root.getDirectory('thumbnails', {
            create: true
        });

        instance.root.getDirectory('audio', {
            create: true
        });
    },
    deserialize: function(json) {
        var store = this.get('store'),
            parsedJSON = JSON.parse(json);

        parsedJSON.albumIds = parsedJSON.albums.map(function(album) {
            var id = album.id;

            delete album.id;

            store.push('album', {
                type: 'album',
                id: id,
                attributes: album
            });

            return id;
        });

        delete parsedJSON.albums;

        parsedJSON.recordingIds = parsedJSON.recordings.map(function(recording) {
            var id = recording.id;

            delete recording.id;

            store.push('recording', {
                type: 'recording',
                id: id,
                attributes: recording
            });

            return id;
        });

        delete parsedJSON.recordings;

        this.setProperties(parsedJSON);

        if (!Ember.isEmpty(this.get('didParseJSON'))) {
            this.didParseJSON();
        }
    },
    serialize: function() {
        var store = this.get('store'),
            data = {
                playingRecordingId: this.get('playingRecordingId')
            };

        data.albums = this.get('albumsIds').map(function(id) {
            return store.peekRecord('album', id).serialize();
        });

        data.recordings = this.get('recordingIds').map(function(id) {
            return store.peekRecord('recording', id).serialize();
        });

        return JSON.stringify(data);
    }
});
