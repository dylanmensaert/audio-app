import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import recordingActionsMixin from 'audio-app/recording/actions-mixin';

export default Ember.Controller.extend(controllerMixin, recordingActionsMixin, {
    audioPlayer: Ember.inject.service(),
    cache: Ember.inject.service(),
    queryParams: ['query'],
    query: '',
    recordings: function() {
        var query = {
            maxResults: 50,
            query: this.get('query'),
            nextPageToken: this.get('nextPageToken')
        };

        return this.find('recording', query, !this.get('cache.searchDownloadedOnly'));
    }.property('query', 'cache.searchDownloadedOnly'),
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
        selectAll: function() {
            this.get('recordings').setEach('isSelected', true);
        },
        didScrollToBottom: function() {
            this.notifyPropertyChange('recordings');
        }
    }
});
