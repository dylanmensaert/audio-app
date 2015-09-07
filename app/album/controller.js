import Ember from 'ember';
import meta from 'meta-data';
import Suggestion from 'audio-app/audio-autocomplete/suggestion';
import logic from 'audio-app/utils/logic';
import controllerMixin from 'audio-app/utils/controller-mixin';
import searchMixin from 'audio-app/utils/search-mixin';
import recordingActionsMixin from 'audio-app/audio-recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, searchMixin, recordingActionsMixin, {
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
            // TODO: implement if album selected
            /*var album = this.get('album');

            if (album.get('isSelected')) {
                if (!Ember.isEmpty(this.get('nextPageToken'))) {
                    logic.findRecordingsByAlbum(album.get('id'), this.get('nextPageToken'), this.get('fileSystem')).then(function (snippets,
                        nextPageToken) {
                        album.get('recordings').pushObjects(snippets);

                        if (Ember.isEmpty(pageToken)) {
                            this.set(property, snippets);
                        } else {
                            this.get(property).pushObjects(snippets);
                        }

                        this.set('nextPageToken', nextPageToken);

                        this.get(property).pushObjects(snippets);
                    });
                }

            } else {*/
            // TODO: super references recordingActionsMixin. Should I use this method since not really OOP
            this._super();
            /*}*/
        }
    }
});
