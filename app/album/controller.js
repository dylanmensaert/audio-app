import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, recordingActionsMixin, {
    audioPlayer: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    query: '',
    model: null,
    isPending: true,
    isLocked: false,
    disableLock: function() {
        this.set('isLocked', false);
    },
    recordings: [],
    updateRecordings: function() {
        var query = {
            albumId: this.get('model.id'),
            maxResults: 50,
            nextPageToken: this.get('nextPageToken')
        };

        this.find('recording', query, !this.get('cache.searchDownloadedOnly')).then(function(recordingsPromise) {
            this.get('recordings').pushObjects(recordingsPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    }.observes('query', 'cache.searchDownloadedOnly').on('init'),
    sortedRecordings: Ember.computed.sort('recordings', function(snippet, other) {
        return this.sortSnippet(this.get('recordings'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedRecordings: function() {
        return this.get('store').peekAll('recording').filterBy('isSelected');
    }.property('recordings.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('recordings.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('recordings.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAlbum: function() {
            this.get('model').set('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked')) {
                this.set('isLocked', true);

                this.updateRecordings();
            }
        },
        download: function() {
            var album = this.get('model');

            if (album.get('isSelected')) {
                this.get('cache').downloadRecordingsForAlbum(album, this.get('nextPageToken'));
            } else {
                this._super();
            }
        },
        removeFromAlbum: function() {
            var recordingIds = this.get('selectedRecordings').mapBy('id'),
                model = this.get('model');

            model.get('recordingIds').removeObjects(recordingIds);

            model.save();
        }
    }
});
