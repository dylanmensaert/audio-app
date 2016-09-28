import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';
import connection from 'connection';

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    model: null,
    nextPageToken: null,
    isPending: true,
    isLocked: false,
    tracks: [],
    disableLock: function() {
        this.set('isLocked', false);
    },
    hideMdlHeader: Ember.computed('selectedTracks.length', 'selectedCollections.length', function() {
        return this.get('selectedTracks.length') || this.get('selectedCollections.length');
    }),
    showNotFound: Ember.computed('isPending', 'tracks.length', function() {
        return !this.get('isPending') && !this.get('tracks.length');
    }),
    searchOnline: function() {
        return !this.get('model.isLocalOnly') && !connection.isMobile();
    },
    updateOnlineTracks: function() {
        var options = {
            collectionId: this.get('model.id'),
            maxResults: 50,
            nextPageToken: this.get('nextPageToken')
        };

        this.set('isLocked', true);

        this.find('track', options, true).then(function(tracksPromise) {
            this.get('tracks').pushObjects(tracksPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    },
    updateOfflineTracks: function() {
        var options = {
            collectionId: this.get('model.id')
        };

        this.find('track', options, false).then(function(tracksPromise) {
            this.set('tracks', tracksPromise.toArray());

            this.set('isPending', false);
        }.bind(this));
    },
    updateOfflineTracksByCollection: Ember.observer('model.trackIds.[]', function() {
        if (!this.searchOnline()) {
            this.updateOfflineTracks();
        }
    }),
    resetController: Ember.observer('model.id', function() {
        this.set('nextPageToken', null);
        this.set('isPending', true);
        this.set('isLocked', false);
        this.set('tracks', []);

        if (this.searchOnline()) {
            this.updateOnlineTracks();
        } else {
            this.updateOfflineTracks();
        }
    }),
    sortedTracks: Ember.computed.sort('tracks', function(snippet, other) {
        return this.sortSnippet(this.get('tracks'), snippet, other, true);
    }),
    selectedTracks: Ember.computed('tracks.@each.isSelected', function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }),
    selectedCollections: Ember.computed('model.isSelected', function() {
        var selectedCollections = [],
            model = this.get('model');

        if (model.get('isSelected')) {
            selectedCollections.pushObject(model);
        }

        return selectedCollections;
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
            this.get('model').set('isSelected', true);
        },
        didScrollToBottom: function() {
            if (!this.get('isLocked') && this.get('nextPageToken')) {
                this.updateOnlineTracks();
            }
        },
        download: function() {
            var collection = this.get('model');

            if (collection.get('isSelected')) {
                collection.download(this.get('nextPageToken'));
            } else {
                this._super();
            }
        },
        removeFromCollection: function() {
            var trackIds = this.get('selectedTracks').mapBy('id'),
                store = this.get('store'),
                collection = this.get('model');

            trackIds.forEach(function(trackId) {
                var track = store.peekRecord('track', trackId);

                collection.removeTrackById(trackId);

                track.set('isSelected', false);
            });
        }
    }
});
