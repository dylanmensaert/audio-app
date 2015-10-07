import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    queryParams: ['query', 'relatedVideoId'],
    query: '',
    relatedVideoId: null,
    tracks: [],
    isPending: true,
    isLocked: false,
    disableLock: function() {
        this.set('isLocked', false);
    },
    nextPageToken: null,
    showNotFound: function() {
        return !this.get('isPending') && !this.get('tracks.length');
    }.property('isPending', 'tracks.length'),
    updateTracks: function() {
        var query = this.get('query'),
            relatedVideoId = this.get('relatedVideoId'),
            options = {
                maxResults: 50,
                query: this.get('query'),
                nextPageToken: this.get('nextPageToken')
            };

        if (query) {
            options.query = query;
        }

        if (relatedVideoId) {
            options.relatedVideoId = relatedVideoId;
        }

        this.find('track', options, !this.get('cache.searchDownloadedOnly')).then(function(tracksPromise) {
            this.get('tracks').pushObjects(tracksPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    }.observes('query', 'relatedVideoId', 'cache.searchDownloadedOnly').on('init'),
    sortedTracks: Ember.computed.sort('tracks', function(snippet, other) {
        return this.sortSnippet(this.get('tracks'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    selectedTracks: function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }.property('tracks.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('tracks.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('tracks.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function() {
            this.get('tracks').setEach('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked')) {
                this.set('isLocked', true);

                this.updateTracks();
            }
        }
    }
});
