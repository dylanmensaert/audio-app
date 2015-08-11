/* global escape */

import Ember from 'ember';
import meta from 'meta-data';
import ytMp3 from 'audio-app/utils/yt-mp3';

var signateUrl,
    extractExtension,
    pluralizations;

signateUrl = function(url) {
    var host = 'http://www.youtube-mp3.org';

    return meta.downloadHost + url + '&s=' + ytMp3.createSignature(host + url);
};

extractExtension = function(source) {
    return source.substr(source.lastIndexOf('.') + 1, source.length);
};

// TODO: Rename audio?
pluralizations = {
    audio: 'audio',
    thumbnail: 'thumbnails'
};

export default Ember.Object.extend({
    init: function() {
        this._super();

        this.set('labels', []);
    },
    id: null,
    name: null,
    extension: null,
    labels: null,
    audio: null,
    thumbnail: null,
    fileSystem: null,
    isSelected: false,
    status: null,
    isOffline: function() {
        return this.get('fileSystem.snippets').isAny('id', this.get('id'));
    }.property('fileSystem.snippets.[]'),
    isDownloading: function() {
        return this.get('status') === 'downloading';
    }.property('status'),
    isPlaying: function() {
        return this.get('fileSystem.playingSnippetId') === this.get('id');
    }.property('fileSystem.playingSnippetId', 'id'),
    isDownloaded: function() {
        return this.get('labels').contains('downloaded');
    }.property('labels.[]'),
    isQueued: function() {
        return this.get('fileSystem.queue').contains(this.get('id'));
    }.property('fileSystem.queue.[]', 'id'),
    isDownloadLater: function() {
        return this.get('labels').contains('download-later');
    }.property('labels.[]'),
    createFilePath: function(type, extension) {
        var fileName = this.get('id') + '.' + extension,
            directory = pluralizations[type];

        return directory + '/' + fileName;
    },
    fetchDownload: function() {
        var videoUrl = 'http://www.youtube.com/watch?v=' + this.get('id'),
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
        this.set('status', 'downloading');

        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (Ember.isEmpty(this.get('audio'))) {
                this.fetchDownload().then(function() {
                    this.insert().then(resolve, reject);
                }.bind(this));
            } else {
                this.insert().then(resolve, reject);
            }
        }.bind(this));
    },
    insert: function() {
        var audio = this.createFilePath('audio', this.get('extension')),
            thumbnail = this.createFilePath('thumbnail', extractExtension(this.get('thumbnail'))),
            promises;

        promises = {
            // TODO: No 'Access-Control-Allow-Origin' header because the requested URL redirects to another domain
            audio: this._download(this.get('audio'), audio),
            // TODO: write to filesystem on snippet property change
            thumbnail: this._download(this.get('thumbnail'), thumbnail)
        };

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.RSVP.hash(promises).then(function(hash) {
                var labels = this.get('labels');

                this.set('audio', hash.audio);
                this.set('thumbnail', hash.thumbnail);

                labels.removeObject('download-later');
                labels.pushObject('downloaded');

                // TODO: update offline labels and snippets in 1 write action
                // TODO: only perform this
                if (!this.get('isOffline')) {
                    this.get('fileSystem.snippets').pushObject(this);
                }

                this.set('status', null);

                resolve();
            }.bind(this), function(reason) {
                reject(reason.message);
            });
        }.bind(this));
    },
    _download: function(url, source) {
        var fileSystem = this.get('fileSystem'),
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
        var fileSystem = this.get('fileSystem'),
            promises;

        promises = {
            audio: fileSystem.remove(this.get('audio')),
            thumbnail: fileSystem.remove(this.get('thumbnail'))
        };

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.RSVP.all(promises).then(function() {
                fileSystem.get('snippets').removeObject(this);

                resolve();
            }.bind(this), reject);
        });
    },
    strip: function() {
        return this.getProperties('id', 'name', 'extension', 'labels', 'thumbnail');
    }
});
