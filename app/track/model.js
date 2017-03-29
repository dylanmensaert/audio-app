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
import searchMixin from 'audio-app/mixins/search';

function signateUrl(url) {
    let host = 'http://www.youtube-mp3.org';

    return domainData.downloadName + url + '&s=' + ytMp3.createSignature(host + url);
}

let extension = {
    audio: 'mp3',
    thumbnail: 'jpg'
};

export default DS.Model.extend(modelMixin, searchMixin, {
    init: function() {
        this._super();

        this.set('relatedTrackIds', []);
    },
    offlineThumbnail: null,
    thumbnail: Ember.computed('offlineThumbnail', 'onlineThumbnail', function() {
        let thumbnail = this.get('offlineThumbnail');

        if (!thumbnail) {
            thumbnail = this.get('onlineThumbnail');
        }

        return thumbnail;
    }),
    propertyNames: ['offlineThumbnail', 'offlineAudio', 'onlineAudio'],
    relatedTrackIds: null,
    relatedTracks: Ember.computed('relatedTrackIds.[]', function() {
        let store = this.store;

        return this.get('relatedTrackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });
    }),
    trackSorting: ['viewCount:desc'],
    sortedRelatedTracks: Ember.computed.sort('relatedTracks', 'trackSorting'),
    // TODO: workaround for index\controller.js
    relatedTracksLength: Ember.computed.alias('relatedTrackIds.length'),
    playableTracks: Ember.computed('sortedRelatedTracks.[]', function() {
        let playableTracks = this.get('sortedRelatedTracks').toArray();

        playableTracks.unshiftObject(this);

        return playableTracks;
    }),
    loadNextRelatedTracks: function() {
        let options = {
            relatedVideoId: this.get('id')
        };

        this.find('track', options).then(function(relatedTracks) {
            return logic.findDetails(relatedTracks);
        }).then(function(relatedTracks) {
            let relatedTrackIds = this.get('relatedTrackIds');

            // TODO: Youtube API, viewCount not working in combination with relatedVideoId, this fixes it
            this.set('nextPageToken', null);

            relatedTracks.forEach(function(track) {
                relatedTrackIds.pushObject(track.get('id'));
            });
        }.bind(this));
    },
    utils: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    onlineAudio: null,
    audio: Ember.computed('offlineAudio', 'onlineAudio', function() {
        let audio = this.get('offlineAudio');

        if (!audio) {
            audio = this.get('onlineAudio');
        }

        return audio;
    }),
    isDownloaded: Ember.computed.bool('offlineAudio'),
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
                    this.set('isSelected', false);
                    this.set('isDisabled', true);

                    this.get('utils').showMessage('Track not available');

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
    isReferenced: function() {
        let store = this.store,
            id = this.get('id');

        return this.get('fileSystem.playlistIds').any(function(playlistId) {
            let playlist = store.peekRecord('playlist', playlistId);

            return playlist.get('trackIds').includes(id);
        });
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
                return this.downloadSource('thumbnail');
            }.bind(this));
        }

        return saving;
    },
    downloadAudio: function() {
        // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
        return this.downloadSource('audio').then(function() {
            this.get('downloadLater.trackIds').removeObject(this.get('id'));
        }.bind(this), function(reason) {
            return reason.message;
        });
    },
    downloadSource: function(type) {
        let source = this.buildFilePath(type),
            name = Ember.String.capitalize(type),
            url = this.get('online' + name),
            fileSystem = this.get('fileSystem'),
            track = this;

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
    },
    removeSource: function(type) {
        let name = 'offline' + Ember.String.capitalize(type);

        return this.get('fileSystem').remove(this.get(name)).then(function() {
            this.set(name, null);
        }.bind(this));
    },
    didRemoveFromPlaylist: function() {
        let promise;

        if (!this.get('isDownloaded') && !this.isReferenced()) {
            promise = this.remove(true);
        } else {
            promise = Ember.RSVP.resolve();
        }

        return promise;
    },
    remove: function(isForced) {
        let promises = [
            this.removeSource('audio')
        ];

        if (isForced || !this.isReferenced()) {
            let promise = this.removeSource('thumbnail').then(function() {
                this.removeRecord('track');
            }.bind(this));

            promises.pushObject(promise);
        }

        return Ember.RSVP.all(promises);
    }
});
