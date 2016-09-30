import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';
import connection from 'connection';

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
    showNotFound: Ember.computed('isPending', 'tracks.length', function() {
        return !this.get('isPending') && !this.get('tracks.length');
    }),
    updateTracks: function() {
        var query = this.get('query'),
            relatedVideoId = this.get('relatedVideoId'),
            options = {
                maxResults: 50,
                nextPageToken: this.get('nextPageToken')
            };

        if (query) {
            options.query = query;
        }

        if (relatedVideoId) {
            options.relatedVideoId = relatedVideoId;
        }

        this.find('track', options, !connection.isMobile()).then(function(tracksPromise) {
            this.get('tracks').pushObjects(tracksPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    },
    resetController: Ember.observer('query', 'relatedVideoId', function() {
        this.set('nextPageToken', null);
        this.set('isPending', true);
        this.set('isLocked', false);
        this.set('tracks', []);

        this.updateTracks();
    }),
    sortedTracks: Ember.computed.sort('tracks', function(snippet, other) {
        return this.sortSnippet(this.get('tracks'), snippet, other, connection.isMobile());
    }),
    selectedTracks: Ember.computed('tracks.@each.isSelected', function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('tracks.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('tracks.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function() {
            this.get('tracks').setEach('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked') && this.get('nextPageToken')) {
                this.set('isLocked', true);

                this.updateTracks();
            }
        }
    }
});
