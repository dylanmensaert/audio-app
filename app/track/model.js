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
    },
    audioPlayer: Ember.inject.service(),
    onlineAudio: null,
    thumbnail: Ember.computed('onlineThumbnail', 'isSaved', function() {
        let thumbnail;

        if (this.get('isSaved')) {
            thumbnail = domainData.fileSystemName + '/' + this.createFilePath('thumbnail');
        } else {
            thumbnail = this.get('onlineThumbnail');
        }

        return thumbnail;
    }),
    audio: Ember.computed('onlineAudio', 'isSaved', function() {
        let audio;

        if (this.get('isSaved')) {
            audio = domainData.fileSystemName + '/' + this.createFilePath('audio');
        } else {
            audio = this.get('onlineAudio');
        }

        return audio;
    }),
    isDownloading: false,
    isDownloaded: false,
    isSaved: Ember.computed('id', 'fileSystem.trackIds.[]', function() {
        return this.get('fileSystem.trackIds').includes(this.get('id'));
    }),
    isPlaying: Ember.computed('audioPlayer.track.id', 'id', function() {
        return this.get('audioPlayer.track.id') === this.get('id');
    }),
    isDownloadable: Ember.computed('isDownloaded', 'isDownloading', function() {
        return !this.get('isDownloaded') && !this.get('isDownloading');
    }),
    queue: Ember.computed(function() {
        return this.store.peekRecord('playlist', 'queue');
    }),
    isQueued: Ember.computed('queue.trackIds.[]', 'id', function() {
        return this.get('queue.trackIds').includes(this.get('id'));
    }),
    downloadLater: Ember.computed(function() {
        return this.store.peekRecord('playlist', 'download-later');
    }),
    isDownloadLater: Ember.computed('downloadLater.trackIds.[]', 'id', function() {
        return this.get('downloadLater.trackIds').includes(this.get('id'));
    }),
    isReferenced: function() {
        let store = this.store,
            id = this.get('id');

        return this.get('fileSystem.playlistIds').any(function(playlistId) {
            let playlist = store.peekRecord('playlist', playlistId);

            return playlist.get('trackIds').includes(id);
        });
    },
    createFilePath: function(type) {
        let fileName = this.get('name') + '.' + extension[type],
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

                this.set('onlineAudio', signateUrl(url));

                return this.get('onlineAudio');
            }.bind(this));
        }.bind(this));
    },
    download: function() {
        this.set('isDownloading', true);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (!this.get('onlineAudio')) {
                this.fetchDownload().then(function() {
                    this.insert().then(resolve, reject);
                }.bind(this));
            } else {
                this.insert().then(resolve, reject);
            }
        }.bind(this));
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

        Ember.RSVP.all(promises).then(function() {
            this.store.peekRecord('playlist', 'download-later').get('trackIds').removeObject(this.get('id'));

            this.set('isDownloading', false);
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
    removeFromPlayList: function(playList) {
        let promise;

        playList.get('trackIds').removeObject(this.get('id'));

        if (!this.isReferenced()) {
            promise = this.remove();
        }

        return Ember.RSVP.resolve(promise);
    },
    remove: function() {
        let fileSystem = this.get('fileSystem'),
            isReferenced = this.isReferenced(),
            promises = [
                fileSystem.remove(this.get('audio'))
            ];

        if (!isReferenced) {
            let promise = fileSystem.remove(this.get('thumbnail'));

            promises.pushObject(promise);
        }

        return Ember.RSVP.all(promises).then(function() {
            let promises = [
                this.destroyRecord()
            ];

            if (!isReferenced) {
                fileSystem.get('trackIds').removeObject(this.get('id'));

                promises.pushObject(fileSystem.save());
            }

            return Ember.RSVP.all(promises);
        }.bind(this));
    }
});
