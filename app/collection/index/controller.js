import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    model: null,
    nextPageToken: null,
    isPending: true,
    isLocked: false,
    tracks: [],
    disableLock: function () {
        this.set('isLocked', false);
    },
    showNotFound: function () {
        return !this.get('isPending') && !this.get('tracks.length');
    }.property('isPending', 'tracks.length'),
    searchOnline: function () {
        return !this.get('model.isLocalOnly') && !this.get('cache.searchDownloadedOnly');
    }.property('model.isLocalOnly', 'cache.searchDownloadedOnly'),
    updateOnlineTracks: function () {
        var options = {
            collectionId: this.get('model.id'),
            maxResults: 50,
            nextPageToken: this.get('nextPageToken')
        };

        this.find('track', options, true).then(function (tracksPromise) {
            this.get('tracks').pushObjects(tracksPromise.toArray());

            Ember.run.scheduleOnce('afterRender', this, this.disableLock);

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    },
    updateOfflineTracks: function () {
        var options = {
            collectionId: this.get('model.id')
        };

        this.set('isPending', true);

        this.find('track', options, false).then(function (tracksPromise) {
            this.set('tracks', tracksPromise.toArray());

            this.set('isPending', false);
        }.bind(this));
    },
    updateTracks: function () {
        if (this.get('searchOnline')) {
            this.updateOnlineTracks();
        } else {
            this.updateOfflineTracks();
        }
    }.observes('model.trackIds'),
    resetController: function () {
        this.set('nextPageToken', null);
        this.set('isPending', true);
        this.set('isLocked', false);
        this.set('tracks', []);

        this.updateTracks();
    }.observes('model.id', 'searchOnline'),
    sortedTracks: Ember.computed.sort('tracks', function (snippet, other) {
        return this.sortSnippet(this.get('model.trackIds'), snippet, other, true);
    }),
    selectedTracks: function () {
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
        selectAll: function () {
            this.get('model').set('isSelected', true);
        },
        didScrollToBottom: function () {
            if (!this.get('isLocked') && this.get('nextPageToken')) {
                this.set('isLocked', true);

                this.updateOnlineTracks();
            }
        },
        download: function () {
            var collection = this.get('model');

            if (collection.get('isSelected')) {
                collection.download(this.get('nextPageToken'));
            } else {
                this._super();
            }
        },
        removeFromCollection: function () {
            var trackIds = this.get('selectedTracks').mapBy('id'),
                model = this.get('model');

            model.get('trackIds').removeObjects(trackIds);

            model.save();
        }
    }
});
