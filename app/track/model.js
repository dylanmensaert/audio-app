/* global encodeURIComponent, Blob */

import DS from 'ember-data';
import Ember from 'ember';
import modelMixin from 'audio-app/mixins/model';
import domainData from 'domain-data';
import ytMp3 from 'audio-app/utils/yt-mp3';
import Inflector from 'ember-inflector';
import logic from 'audio-app/utils/logic';

function signateUrl(url) {
    let host = 'http://www.youtube-mp3.org';

    return domainData.downloadName + url + '&s=' + ytMp3.createSignature(host + url);
}

let extension = {
    audio: 'mp3',
    thumbnail: 'jpg'
};

export default DS.Model.extend(modelMixin, {
    init: function() {
        this._super();

        if (this.get('isSaved')) {
            this.get('fileSystem.instance').root.getFile(this.createFilePath('audio'), {}, function() {
                this.set('isDownloaded', true);
            }.bind(this), function() {
                this.set('isDownloaded', false);
            }.bind(this));
        }

        this.set('tracks', [
            this
        ]);
    },
    tracks: null,
    utils: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    onlineAudio: null,
    thumbnail: Ember.computed('onlineThumbnail', 'isSaved', function() {
        let thumbnail;

        if (this.get('isSaved')) {
            thumbnail = domainData.fileSystemName + '/' + this.getFilePath('thumbnail');
        } else {
            thumbnail = this.get('onlineThumbnail');
        }

        return thumbnail;
    }),
    audio: Ember.computed('onlineAudio', 'isDownloaded', function() {
        let audio;

        if (this.get('isDownloaded')) {
            audio = domainData.fileSystemName + '/' + this.getFilePath('audio');
        } else {
            audio = this.get('onlineAudio');
        }

        return audio;
    }),
    isDownloaded: false,
    viewCount: null,
    isSaved: Ember.computed('id', 'fileSystem.trackIds.[]', function() {
        return this.get('fileSystem.trackIds').includes(this.get('id'));
    }),
    isActive: Ember.computed('audioPlayer.track.id', 'id', function() {
        return this.get('audioPlayer.track.id') === this.get('id');
    }),
    isPlaying: Ember.computed('isActive', 'audioPlayer.isPlaying', function() {
        return this.get('isActive') && this.get('audioPlayer.isPlaying');
    }),
    isDownloadable: Ember.computed('isDownloaded', 'isDownloading', function() {
        return !this.get('isDownloaded') && !this.get('isDownloading');
    }),
    downloadLater: Ember.computed(function() {
        return this.store.peekRecord('playlist', 'download-later');
    }),
    canDownloadLater: Ember.computed('isDownloadable', 'downloadLater.trackIds.[]', 'id', function() {
        let downloadLater = this.get('downloadLater');

        return this.get('isDownloadable') && downloadLater.get('trackIds').includes(this.get('id'));
    }),
    isDisabled: false,
    isReferenced: function() {
        let store = this.store,
            id = this.get('id');

        return this.get('fileSystem.playlistIds').any(function(playlistId) {
            let playlist = store.peekRecord('playlist', playlistId);

            return playlist.get('trackIds').includes(id);
        });
    },
    getFilePath: function(type) {
        return encodeURIComponent(this.createFilePath(type));
    },
    createFilePath: function(type) {
        let fileName = this.get('name') + '.' + extension[type],
            directory = Inflector.inflector.pluralize(type);

        return directory + '/' + fileName;
    },
    findAudioSource: function() {
        let videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
            url = '/a/pushItem/?',
            promise;

        url += 'item=' + encodeURIComponent(videoUrl);
        url += '&el=na&bf=false';
        url += '&r=' + new Date().getTime();

        promise = Ember.$.ajax(signateUrl(url)).then(function(videoId) {
            url = '/a/itemInfo/?';
            url += 'video_id=' + videoId;
            url += '&ac=www&t=grp';
            url += '&r=' + new Date().getTime();

            return Ember.$.ajax(signateUrl(url)).then(function(info) {
                info = info.substring(7, info.length - 1);
                info = JSON.parse(info);

                url = '/get?';
                url += 'video_id=' + videoId;
                url += '&ts_create=' + info.ts_create;
                url += '&r=' + info.r;
                url += '&h2=' + info.h2;

                url = signateUrl(url);

                this.set('onlineAudio', url);

                return url;
            }.bind(this));
        }.bind(this));

        promise = Ember.RSVP.resolve(promise);

        promise.catch(function() {
            this.setDisabled();
        }.bind(this));

        return promise;
    },
    setDisabled: function() {
        if (!this.get('isDisabled')) {
            let store = this.get('store'),
                id = this.get('id');

            this.get('fileSystem.playlistIds').forEach(function(playlistId) {
                let playlist = store.peekRecord('playlist', playlistId);

                playlist.get('trackIds').removeObject(id);
            });

            this.remove();

            this.set('isDisabled', true);
            this.get('utils').showMessage('Track not available');
        }
    },
    isDownloading: Ember.computed('downloading.isPending', function() {
        return this.get('downloading.isPending');
    }),
    downloading: null,
    download: function() {
        let downloading,
            promise;

        promise = new Ember.RSVP.Promise(function(resolve, reject) {
            if (!this.get('onlineAudio')) {
                this.findAudioSource().then(function() {
                    this.insert().then(resolve, reject);
                }.bind(this), reject);
            } else {
                this.insert().then(resolve, reject);
            }
        }.bind(this));

        promise.catch(function() {
            this.setDisabled();
        }.bind(this));

        downloading = logic.ObjectPromiseProxy.create({
            promise: promise
        });

        this.set('downloading', downloading);

        return downloading;
    },
    insertWithoutAudio: function() {
        return this.downloadSource(this.get('onlineThumbnail'), this.createFilePath('thumbnail'));
    },
    insert: function() {
        let promises = [
            // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
            this.downloadSource(this.get('onlineAudio'), this.createFilePath('audio'))
        ];

        if (!this.get('isSaved')) {
            // TODO: write to filesystem on track property change
            let promise = this.insertWithoutAudio().then(function() {
                this.get('fileSystem.tracksIds').pushObject(this.get('id'));
            }.bind(this));

            promises.pushObject(promise);
        }

        return Ember.RSVP.all(promises).then(function() {
            this.store.peekRecord('playlist', 'download-later').get('trackIds').removeObject(this.get('id'));

            this.set('isDownloaded', true);
        }.bind(this), function(reason) {
            return reason.message;
        });
    },
    downloadSource: function(url, source) {
        let fileSystem = this.get('fileSystem');

        return new Ember.RSVP.Promise(function(resolve) {
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
                            resolve(fileEntry.toURL());
                        };

                        fileWriter.write(new Blob([response]));
                    });
                });
            };

            xhr.send();
        });
    },
    remove: function() {
        let fileSystem = this.get('fileSystem'),
            promises = [
                fileSystem.remove(this.get('audio'))
            ];

        if (!this.isReferenced()) {
            let promise = fileSystem.remove(this.get('thumbnail'));

            promise.then(function() {
                return this.removeRecord('track');
            }.bind(this));

            promises.pushObject(promise);
        }

        return Ember.RSVP.all(promises);
    }
});
