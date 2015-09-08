/* global escape */

import Ember from 'ember';
import meta from 'meta-data';
import ytMp3 from 'audio-app/utils/yt-mp3';
import Snippet from 'audio-app/utils/snippet';

var signateUrl,
    extractExtension,
    pluralizations;

signateUrl = function (url) {
    var host = 'http://www.youtube-mp3.org';

    return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
};

extractExtension = function (source) {
    return source.substr(source.lastIndexOf('.') + 1, source.length);
};

// TODO: Rename audio?
pluralizations = {
    audio: 'audio',
    thumbnail: 'thumbnails'
};

export default Snippet.extend({
    fileSystem: Ember.inject.service(),
    extension: null,
    audio: null,
    status: null,
    isOffline: function () {
        return this.get('fileSystem.recordings').isAny('id', this.get('id'));
    }.property('fileSystem.recordings.[]'),
    isDownloading: function () {
        return this.get('status') === 'downloading';
    }.property('status'),
    isPlaying: function () {
        return this.get('fileSystem.playingRecordingId') === this.get('id');
    }.property('fileSystem.playingRecordingId', 'id'),
    isDownloaded: function () {
        return new Ember.RSVP.Promise(function (resolve) {
            return this.get('fileSystem.instance').root.getFile(this.createFilePath('audio', this.get('extension')), {}, function () {
                resolve(true);
            }, function () {
                resolve(false);
            });
        }.bind(this));
    }.property('audio', 'fileSystem.instance'),
    isQueued: function () {
        return this.get('fileSystem.albums').findBy('name', 'Queue').get('recordingIds').contains(this.get('id'));
    }.property('fileSystem.albums.@each.recordingIds.[]', 'id'),
    isDownloadLater: function () {
        return this.get('fileSystem.albums').findBy('name', 'Download later').get('recordingIds').contains(this.get('id'));
    }.property('fileSystem.albums.@each.recordingIds.[]', 'id'),
    createFilePath: function (type, extension) {
        var fileName = this.get('id') + '.' + extension,
            directory = pluralizations[type];

        return directory + '/' + fileName;
    },
    fetchDownload: function () {
        var videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
            url;

        url = '/a/pushItem/?';
        url += 'item=' + escape(videoUrl);
        url += '&el=na&bf=false';
        url += '&r=' + new Date().getTime();

        return Ember.$.ajax(signateUrl(url)).then(function (videoId) {
            url = '/a/itemInfo/?';
            url += 'video_id=' + videoId;
            url += '&ac=www&t=grp';
            url += '&r=' + new Date().getTime();

            return Ember.$.ajax(signateUrl(url)).then(function (info) {
                info = info.substring(7, info.length - 1);
                info = JSON.parse(info);

                url = '/get?';
                url += 'video_id=' + videoId;
                url += '&ts_create=' + info.ts_create;
                url += '&r=' + info.r;
                url += '&h2=' + info.h2;

                this.set('audio', signateUrl(url));

                return this.get('audio');
            }.bind(this));
        }.bind(this));
    },
    download: function () {
        this.set('status', 'downloading');

        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (Ember.isEmpty(this.get('audio'))) {
                this.fetchDownload().then(function () {
                    this.insert().then(resolve, reject);
                }.bind(this));
            } else {
                this.insert().then(resolve, reject);
            }
        }.bind(this));
    },
    insert: function () {
        var audio = this.createFilePath('audio', this.get('extension')),
            thumbnail = this.createFilePath('thumbnail', extractExtension(this.get('thumbnail'))),
            promises;

        promises = {
            // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
            audio: this._download(this.get('audio'), audio),
            // TODO: write to filesystem on recording property change
            thumbnail: this._download(this.get('thumbnail'), thumbnail)
        };

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.RSVP.hash(promises).then(function (hash) {
                this.set('audio', hash.audio);
                this.set('thumbnail', hash.thumbnail);

                this.get('fileSystem.albums').findBy('name', 'Download later').get('recordingIds').removeObject(this.get('id'));

                // TODO: update offline albums and recordings in 1 write action
                // TODO: only perform this
                if (!this.get('isOffline')) {
                    this.get('fileSystem.recordings').pushObject(this);
                }

                this.set('status', null);

                resolve();
            }.bind(this), function (reason) {
                reject(reason.message);
            });
        }.bind(this));
    },
    _download: function (url, source) {
        var fileSystem = this.get('fileSystem'),
            xhr = new XMLHttpRequest(),
            response;

        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';

        return new Ember.RSVP.Promise(function (resolve) {
            xhr.onload = function () {
                response = this.response;

                fileSystem.get('instance').root.getFile(source, {
                    create: true
                }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function () {
                            resolve(fileEntry.toURL());
                        };

                        fileWriter.write(new Blob([response]));
                    });
                });
            };

            xhr.send();
        });
    },
    remove: function () {
        var fileSystem = this.get('fileSystem'),
            promises;

        promises = {
            audio: fileSystem.remove(this.get('audio')),
            thumbnail: fileSystem.remove(this.get('thumbnail'))
        };

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.RSVP.all(promises).then(function () {
                fileSystem.get('recordings').removeObject(this);

                resolve();
            }.bind(this), reject);
        });
    },
    getPropertyNamesToSave: function () {
        var propertyNames = this._super();

        propertyNames.pushObjects(['extension', 'thumbnail']);

        return propertyNames;
    }
});
