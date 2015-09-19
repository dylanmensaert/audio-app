/* global window, Blob, FileReader, PERSISTENT, Number, requestFileSystem */
import Ember from 'ember';
// TODO: implement correctly
/*import Album from 'audio-app/album/model';
import Recording from 'audio-app/recording/model';*/

var write,
    lastWriter;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

write = function () {
    var json = this.toJSON();

    this.get('instance').root.getFile('data.json', {}, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = function () {
                if (!fileWriter.length) {
                    fileWriter.write(new Blob([json], {
                        type: 'application/json'
                    }));
                }
            };

            fileWriter.truncate(0);
        });
    });
};

export default Ember.Service.extend({
    init: function () {
        this._super();

        this.forge();
    },
    instance: null,
    albums: [],
    recordings: [],
    playingRecordingId: null,
    setDownloadedOnlyOnMobile: true,
    setDownloadLaterOnMobile: true,
    setDownloadBeforePlaying: false,
    didParseJSON: null,
    // TODO: http://stackoverflow.com/questions/30109066/html-5-file-system-how-to-increase-persistent-storage
    forge: function () {
        navigator.webkitPersistentStorage.queryUsageAndQuota(function (usage, quota) {
            if (quota > usage) {
                this.create(quota).then(this.createFiles.bind(this));
            } else {
                this.increaseQuota().then(this.createFiles.bind(this));
            }
        }.bind(this));
    },
    increaseQuota: function () {
        return new Ember.RSVP.Promise(function (resolve) {
            navigator.webkitPersistentStorage.requestQuota(Number.MAX_SAFE_INTEGER, function (bytes) {
                this.create(bytes).then(resolve);
            }.bind(this));
        }.bind(this));
    },
    create: function (bytes) {
        return new Ember.RSVP.Promise(function (resolve) {
            requestFileSystem(PERSISTENT, bytes, function (fileSystem) {
                this.set('instance', fileSystem);

                resolve(fileSystem);
            }.bind(this));
        }.bind(this));
    },
    write: function () {
        Ember.run.cancel(lastWriter);

        lastWriter = Ember.run.later(this, write, 100);
    }.observes('playingRecordingId', 'albums.@each.recordingIds.[]', 'recordings.[]'),
    remove: function (source) {
        return new Ember.RSVP.Promise(function (resolve) {
            this.get('instance').root.getFile(source, {}, function (fileEntry) {
                fileEntry.remove(function () {
                    resolve();
                });
            });
        }.bind(this));
    },
    createFiles: function (instance) {
        var reader,
            parseJSON = this.parseJSON.bind(this);

        instance.root.getFile('data.json', {}, function (fileEntry) {
            fileEntry.file(function (file) {
                reader = new FileReader();

                reader.onloadend = function () {
                    parseJSON(this.result);
                };

                reader.readAsText(file);
            });
        }, function () {
            instance.root.getFile('data.json', {
                create: true
            }, function () {
                // TODO: implement correctly
                /*this.get('albums').pushObject(Album.create({
                    name: 'Download later',
                    permission: 'push-only'
                }));

                this.get('albums').pushObject(Album.create({
                    name: 'Queue',
                    permission: 'push-only'
                }));

                this.get('albums').pushObject(Album.create({
                    name: 'History',
                    permission: 'read-only'
                }));*/
            }.bind(this));
        }.bind(this));

        instance.root.getDirectory('thumbnails', {
            create: true
        });

        instance.root.getDirectory('audio', {
            create: true
        });
    },
    parseJSON: function () /*TODO: implement param, avoiding jshint to throw error: json*/ {
        // TODO: implement correctly
        /*var parsedJSON = JSON.parse(json);

        parsedJSON.albums = parsedJSON.albums.map(function (album) {
            return Album.create(album);
        });

        parsedJSON.recordings = parsedJSON.recordings.map(function (recording) {
            recording.fileSystem = this;

            return Recording.create(recording);
        }.bind(this));

        this.setProperties(parsedJSON);*/

        if (!Ember.isEmpty(this.get('didParseJSON'))) {
            this.didParseJSON();
        }
    },
    toJSON: function () {
        var data = {
            playingRecordingId: this.get('playingRecordingId')
        };

        data.albums = this.get('albums').map(function (album) {
            return album.strip();
        });

        data.recordings = this.get('recordings').map(function (recording) {
            return recording.strip();
        });

        return JSON.stringify(data);
    }
});
