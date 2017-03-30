/* global window, Blob, FileReader, PERSISTENT, Number */

import Ember from 'ember';

// TODO: implement correctly
/*import Playlist from 'audio-app/playlist/model';
import Track from 'audio-app/track/model';*/

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function write() {
    let json = this.serialize();

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
}

export default Ember.Service.extend({
    store: Ember.inject.service(),
    instance: null,
    playlistIds: null,
    trackIds: null,
    downloadLater: false,
    // TODO: downloadBeforePlaying to true
    downloadBeforePlaying: false,
    // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
    forge: function() {
        return new Ember.RSVP.Promise(function(resolve) {
            navigator.webkitPersistentStorage.queryUsageAndQuota(function(usage, quota) {
                if (quota === 0 || quota > usage) {
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
            window.requestFileSystem(PERSISTENT, bytes, function(fileSystem) {
                this.set('instance', fileSystem);

                resolve(fileSystem);
            }.bind(this));
        }.bind(this));
    },
    remove: function(source) {
        return new Ember.RSVP.Promise(function(resolve) {
            if (source) {
                this.get('instance').root.getFile(source, {}, function(fileEntry) {
                    fileEntry.remove(function() {
                        resolve();
                    });
                }, resolve);
            } else {
                resolve();
            }
        }.bind(this));
    },
    createFiles: function(instance) {
        let deserialize = this.deserialize.bind(this);

        return new Ember.RSVP.Promise(function(resolve) {
            instance.root.getDirectory('thumbnails', {
                create: true
            });

            instance.root.getDirectory('audios', {
                create: true
            });

            instance.root.getFile('data.json', {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    let reader = new FileReader();

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
                        playlists: [{
                            id: 'download-later',
                            name: 'Download later',
                            isLocalOnly: true,
                            permission: 'modify-only'
                        }, {
                            id: 'history',
                            name: 'History',
                            isLocalOnly: true,
                            permission: 'read-only'
                        }]
                    }));

                    this.save();

                    resolve();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    save: function() {
        Ember.run.debounce(this, write, 100);
    },
    deserialize: function(json) {
        let store = this.get('store'),
            parsedJSON = JSON.parse(json),
            playlists = parsedJSON.playlists,
            tracks = parsedJSON.tracks;

        parsedJSON.playlistIds = playlists.map(function(playlist) {
            return playlist.id;
        });

        delete parsedJSON.playlists;

        parsedJSON.trackIds = tracks.map(function(track) {
            return track.id;
        });

        delete parsedJSON.tracks;

        this.setProperties(parsedJSON);

        playlists.map(function(playlist) {
            let id = playlist.id;

            delete playlist.id;

            store.push({
                data: {
                    type: 'playlist',
                    id: id,
                    attributes: playlist
                }
            });
        });

        tracks.forEach(function(track) {
            let id = track.id;

            delete track.id;

            store.push({
                data: {
                    type: 'track',
                    id: id,
                    attributes: track
                }
            });
        });
    },
    serialize: function() {
        let store = this.get('store'),
            data = {};

        data.playlists = this.get('playlistIds').map(function(id) {
            return store.peekRecord('playlist', id).serialize();
        });

        data.tracks = this.get('trackIds').map(function(id) {
            return store.peekRecord('track', id).serialize();
        });

        return JSON.stringify(data);
    }
});
