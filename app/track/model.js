/* global encodeURIComponent, Blob */

import DS from 'ember-data';
import Ember from 'ember';
import modelMixin from 'audio-app/mixins/model';
import domainData from 'domain-data';
import ytMp3 from 'audio-app/utils/yt-mp3';
import Inflector from 'ember-inflector';
import logic from 'audio-app/utils/logic';
import connection from 'connection';
import sanitizeFilename from 'npm:sanitize-filename';

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
            this.get('fileSystem.instance').root.getFile(this.buildFilePath('audio'), {}, function() {
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
    audio: Ember.computed('onlineAudio', 'isDownloaded', function() {
        let audio;

        if (this.get('isDownloaded')) {
            audio = domainData.fileSystemName + '/' + this.buildFilePath('audio');
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
    connection: connection,
    canDownloadLater: Ember.computed('connection.isWifi', 'isDownloadable', 'downloadLater.trackIds.[]', 'id', function() {
        let downloadLater = this.get('downloadLater');

        return !this.get('connection.isWifi') && this.get('isDownloadable') && !downloadLater.get('trackIds').includes(this.get('id'));
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
    buildFilePath: function(type) {
        let directory = Inflector.inflector.pluralize(type);

        return directory + '/' + sanitizeFilename(this.get('name')) + '.' + extension[type];
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
                if (info === 'pushItemYTError();') {
                    this.setDisabled();

                    url = null;
                } else {
                    info = info.substring(7, info.length - 1);
                    info = JSON.parse(info);

                    url = '/get?';
                    url += 'video_id=' + videoId;
                    url += '&ts_create=' + info.ts_create;
                    url += '&r=' + info.r;
                    url += '&h2=' + info.h2;

                    url = signateUrl(url);

                    this.set('onlineAudio', url);
                }

                return url;
            }.bind(this));
        }.bind(this));

        return Ember.RSVP.resolve(promise);
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

            this.set('isSelected', false);
            this.set('isDisabled', true);
            this.get('utils').showMessage('Track not available');
        }
    },
    isDownloading: Ember.computed('downloading.isPending', function() {
        return this.get('downloading.isPending');
    }),
    downloading: null,
    download: function() {
        if (!this.get('isDownloading')) {
            let downloading,
                promise;

            if (this.get('onlineAudio')) {
                promise = Ember.RSVP.resolve();
            } else {
                promise = this.findAudioSource();
            }

            promise = promise.then(function() {
                return this.save();
            }.bind(this)).then(function() {
                return this.downloadAudio();
            }.bind(this));

            downloading = logic.ObjectPromiseProxy.create({
                promise: promise
            });

            this.set('downloading', downloading);
        }

        return this.get('downloading');
    },
    save: function() {
        let saving = this._super();

        if (!this.get('isSaved')) {
            saving = saving.then(function() {
                return this.downloadSource('thumbnail', this.get('thumbnail')).then(function(thumbnail) {
                    this.set('thumbnail', thumbnail);
                }.bind(this));
            }.bind(this));
        }

        return saving;
    },
    downloadAudio: function() {
        // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
        return this.downloadSource('audio', this.get('onlineAudio')).then(function() {
            this.get('downloadLater.trackIds').removeObject(this.get('id'));

            this.set('isDownloaded', true);
        }.bind(this), function(reason) {
            return reason.message;
        });
    },
    downloadSource: function(type, url) {
        let source = this.buildFilePath(type),
            fileSystem = this.get('fileSystem');

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
                            resolve(fileEntry.toURL());
                        };

                        fileWriter.write(new Blob([response]));
                    });
                }, reject);
            };

            xhr.send();
        });
    },
    didRemove: function() {
        let promise;

        if (this.isReferenced()) {
            promise = Ember.RSVP.resolve();
        } else {
            let fileSystem = this.get('fileSystem'),
                promises;

            promises = [
                fileSystem.remove(this.get('audio')),
                fileSystem.remove(this.get('thumbnail'))
            ];

            promise = Ember.RSVP.all(promises).then(function() {
                return this.removeRecord('track');
            }.bind(this));
        }

        return promise;
    },
    remove: function() {
        let promise;

        if (this.isReferenced()) {
            promise = this.get('fileSystem').remove(this.get('audio'));
        } else {
            promise = this.didRemove();
        }

        return promise;
    }
});
