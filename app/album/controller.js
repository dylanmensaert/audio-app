import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/utils/controller-mixin';
import searchMixin from 'audio-app/utils/search-mixin';
import recordingActionsMixin from 'audio-app/audio-recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
    fileSystem: Ember.inject.service(),
    cache: Ember.inject.service(),
    init: function () {
        this._super();

        this.updateOnlineRecordings();
    },
    queryParams: ['returnRoute'],
    returnRoute: null,
    nextPageToken: null,
    didScrollToBottom: function () {
        return function () {
            this.updateOnlineRecordings(this.get('nextPageToken'));
        }.bind(this);
    }.property('nextPageToken'),
    album: function () {
        // TODO: put this in model and work via id. Should keep a cache of all fetched records. Work with ember-data!?
        return this.get('cache.selectedSnippets.firstObject');
    }.property(),
    updateOnlineRecordings: function (nextPageToken) {
        var findRecordingsPromise;

        if (!this.get('searchDownloadedOnly')) {
            findRecordingsPromise = logic.findRecordingsByAlbum(this.get('album.id'), nextPageToken, this.get('fileSystem'));

            this.updateOnlineSnippets(findRecordingsPromise, 'album.onlineRecordings', nextPageToken);
        }
    },
    actions: {
        selectAll: function () {
            this.set('album.isSelected', true);
        },
        transitionBack: function () {
            this.transitionToRoute(this.get('returnRoute'));
        },
        download: function () {
            var album = this.get('album');

            if (album.get('isSelected')) {
                if (!Ember.isEmpty(this.get('nextPageToken'))) {
                    this.findAllRecordingsByAlbum(album.get('id'), this.get('recordings'), this.get('nextPageToken'));
                }

                album.get('recordingIds').clear();

                this.get('fileSystem.albums').pushObject(album);

                this.downloadAllRecordings(this.get('album'), 0);
            } else {
                // TODO: super references recordingActionsMixin. Should I use this method since not really OOP
                this._super();
            }
        },
        downloadAllRecordings: function (album, index) {
            // TODO: this will be undefined when switching routes while downloading
            var recordings = this.get('recordings'),
                recording = recordings.objectAt(index),
                id,
                offlineRecording;

            if (!Ember.isEmpty(recording)) {
                id = recording.get('id');
                offlineRecording = this.get('fileSystem.recordings').findBy('id', id);

                if (!Ember.isEmpty(offlineRecording)) {
                    recording = offlineRecording;
                }

                if (!recording.get('isDownloaded')) {
                    recording.download().then(function () {
                        this.downloadAllRecordings(album, index + 1);
                    });
                }

                if (!album.get('recordingIds').contains(id)) {
                    album.get('recordingIds').pushObject(id);
                }
            }
        },
        findAllRecordingsByAlbum: function (id, recordings, pageToken) {
            logic.findRecordingsByAlbum(id, pageToken, this.get('fileSystem')).then(function (snippets,
                nextPageToken) {
                recordings.pushObjects(snippets);

                if (!Ember.isEmpty(nextPageToken)) {
                    this.findAllRecordingsByAlbum(id, recordings, nextPageToken);
                }
            });
        }
    }
});
