/* global escape, Blob */

import DS from 'ember-data';
import Ember from 'ember';
import modelMixin from 'audio-app/mixins/model';
import domainData from 'domain-data';
import ytMp3 from 'audio-app/utils/yt-mp3';
import Inflector from 'ember-inflector';

function signateUrl(url) {
    let host = 'http://www.youtube-mp3.org';

    return domainData.downloadName + url + '&s=' + ytMp3.createSignature(host + url);
}

function extractExtension(source) {
    return source.substr(source.lastIndexOf('.') + 1, source.length);
}

export default DS.Model.extend(modelMixin, {
    audio: DS.attr('string'),
    thumbnail: DS.attr('string'),
    isDownloading: false,
    isDownloaded: false,
    isSaved: Ember.computed('id', 'fileSystem.trackIds.[]', function() {
        return this.get('fileSystem.trackIds').includes(this.get('id'));
    }),
    isPlaying: Ember.computed('fileSystem.playingTrackId', 'id', function() {
        return this.get('fileSystem.playingTrackId') === this.get('id');
    }),
    updateIsDownloaded: Ember.observer('audio', 'fileSystem.instance', 'extension', function() {
        this.get('fileSystem.instance').root.getFile(this.createFilePath('audio', this.get('extension')), {}, function() {
            this.set('isDownloaded', true);
        }.bind(this), function() {
            this.set('isDownloaded', false);
        }.bind(this));
    }),
    isDownloadable: Ember.computed('isDownloaded', 'isDownloading', function() {
        return !this.get('isDownloaded') && !this.get('isDownloading');
    }),
    isQueued: Ember.computed('playlists.@each.trackIds', 'id', function() {
        return this.get('store').peekRecord('playlist', 'queue').get('trackIds').includes(this.get('id'));
    }),
    isDownloadLater: Ember.computed('playlists.@each.trackIds', 'id', function() {
        return this.get('store').peekRecord('playlist', 'download-later').get('trackIds').includes(this.get('id'));
    }),
    isReferenced: Ember.computed('id', 'fileSystem.playlistIds', 'playlists.@each.trackIds', function() {
        let store = this.get('store'),
            id = this.get('id');

        return this.get('fileSystem.playlistIds').any(function(playlistId) {
            let playlist = store.peekRecord('playlist', playlistId);

            return playlist.get('trackIds').includes(id);
        });
    }),
    createFilePath: function(type, extension) {
        let fileName = this.get('name') + '.' + extension,
            directory = Inflector.inflector.pluralize(type);

        return directory + '/' + fileName;
    },
    fetchDownload: function() {
        let videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
            url;

        url = '/a/pushItem/?';
        url += 'item=' + escape(videoUrl);
        url += '&el=na&bf=false';
        url += '&r=' + new Date().getTime();

        return Ember.$.ajax(signateUrl(url)).then(function(videoId) {
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

                this.set('audio', signateUrl(url));

                return this.get('audio');
            }.bind(this));
        }.bind(this));
    },
    download: function() {
        this.set('isDownloading', true);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!this.get('audio')) {
                this.fetchDownload().then(function() {
                    this.insert().then(resolve, reject);
                }.bind(this));
            } else {
                this.insert().then(resolve, reject);
            }
        }.bind(this));
    },
    insert: function() {
        let audio = this.createFilePath('audio', this.get('extension')),
            currentThumbnail = this.get('thumbnail'),
            thumbnail = this.createFilePath('thumbnail', extractExtension(currentThumbnail)),
            promises;

        promises = {
            // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
            audio: this.downloadSource(this.get('audio'), audio),
            // TODO: write to filesystem on track property change
            thumbnail: this.downloadSource(currentThumbnail, thumbnail)
        };

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.RSVP.hash(promises).then(function(hash) {
                this.set('audio', hash.audio);
                this.set('thumbnail', hash.thumbnail);

                this.get('fileSystem.playlists').findBy('name', 'Download later').get('trackIds').removeObject(this.get('id'));

                if (!this.get('isSaved')) {
                    this.get('fileSystem.tracks').pushObject(this);
                }

                this.set('isDownloading', false);

                resolve();
            }.bind(this), function(reason) {
                reject(reason.message);
            });
        }.bind(this));
    },
    downloadSource: function(url, source) {
        let fileSystem = this.get('fileSystem'),
            xhr = new XMLHttpRequest(),
            response;

        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';

        return new Ember.RSVP.Promise(function(resolve) {
            xhr.onload = function() {
                response = this.response;

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
            promises;

        promises = {
            audio: fileSystem.remove(this.get('audio')),
            thumbnail: fileSystem.remove(this.get('thumbnail'))
        };

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.RSVP.all(promises).then(function() {
                fileSystem.get('tracks').removeObject(this);

                resolve();
            }.bind(this), reject);
        });
    },
    destroy: function() {
        this.remove().then(function() {
            if (!this.get('isReferenced')()) {
                this.destroyRecord();
            }
        }.bind(this));
    },
    propertyNames: 'extension'
});
