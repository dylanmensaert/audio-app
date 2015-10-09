/* global escape, Blob */

import DS from 'ember-data';
import Ember from 'ember';
import modelMixin from 'audio-app/mixins/model';
import meta from 'meta-data';
import ytMp3 from 'audio-app/utils/yt-mp3';
import Inflector from 'ember-inflector';

function signateUrl(url) {
    var host = 'http://www.youtube-mp3.org';

    return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
}

function extractExtension(source) {
    return source.substr(source.lastIndexOf('.') + 1, source.length);
}

export default DS.Model.extend(modelMixin, {
    audio: DS.attr('string'),
    // TODO: is separate status function necessary?
    status: null,
    isDownloaded: false,
    isSaved: function () {
        return this.get('fileSystem.trackIds').contains(this.get('id'));
    }.property('fileSystem.tracks.[]'),
    isDownloading: function () {
        return this.get('status') === 'downloading';
    }.property('status'),
    isPlaying: function () {
        return this.get('fileSystem.playingTrackId') === this.get('id');
    }.property('fileSystem.playingTrackId', 'id'),
    // TODO: check for better solution which uses only one computed property
    updateIsDownloaded: function () {
        this.get('fileSystem.instance').root.getFile(this.createFilePath('audio', this.get('extension')), {}, function () {
            this.set('isDownloaded', true);
        }.bind(this), function () {
            this.set('isDownloaded', false);
        }.bind(this));
    }.observes('audio', 'fileSystem.instance', 'extension'),
    isQueued: function () {
        return this.get('store').peekRecord('collection', 'queue').get('trackIds').contains(this.get('id'));
    }.property('collections.@each.trackIds.[]', 'id'),
    isDownloadLater: function () {
        // TODO: implement
        return false;
        /*return this.get('fileSystem.collections').findBy('name', 'Download later').get('trackIds').contains(this.get('id'));*/
    }.property('fileSystem.collections.@each.trackIds.[]', 'id'),
    createFilePath: function (type, extension) {
        var fileName = this.get('id') + '.' + extension,
            directory = Inflector.inflector.pluralize(type);

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
            if (!this.get('audio')) {
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
            audio: this.downloadSource(this.get('audio'), audio),
            // TODO: write to filesystem on track property change
            thumbnail: this.downloadSource(this.get('thumbnail'), thumbnail)
        };

        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.RSVP.hash(promises).then(function (hash) {
                this.set('audio', hash.audio);
                this.set('thumbnail', hash.thumbnail);

                this.get('fileSystem.collections').findBy('name', 'Download later').get('trackIds').removeObject(this.get('id'));

                // TODO: update offline collections and tracks in 1 write action
                // TODO: only perform this
                if (!this.get('isSaved')) {
                    this.get('fileSystem.tracks').pushObject(this);
                }

                this.set('status', null);

                resolve();
            }.bind(this), function (reason) {
                reject(reason.message);
            });
        }.bind(this));
    },
    downloadSource: function (url, source) {
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
                fileSystem.get('tracks').removeObject(this);

                resolve();
            }.bind(this), reject);
        });
    },
    getIsReferenced: function () {
        var store = this.get('store'),
            id = this.get('id');

        return this.get('fileSystem.collectionIds').isAny(function (collectionId) {
            var collection = store.peekRecord('collection', collectionId);

            return collection.get('trackIds').contains(id);
        });
    },
    destroy: function () {
        var store = this.get('store');

        this.remove().then(function () {
            if (!this.getIsReferenced()) {
                this.destroyRecord();
            }
        }.bind(this));
    },
    propertyNames: 'extension'
});
