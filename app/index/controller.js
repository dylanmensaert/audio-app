import Ember from 'ember';
import DS from 'ember-data';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';
import logic from 'audio-app/utils/logic';

const lastHistoryTracksLimit = 8;

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    showNotFound: Ember.computed('lastHistoryTracks.isPending', 'lastHistoryTracks.length', 'lastHistoryTracks.length', function() {
        return !this.get('lastHistoryTracks.isPending') && !this.get('lastHistoryTracks.length') && !this.get('lastHistoryTracks.length');
    }),
    lastHistoryTracks: Ember.computed('collections.@each.trackIds', function() {
        var store = this.get('store'),
            historyTrackIds = store.peekRecord('collection', 'history').get('trackIds'),
            length = historyTrackIds.get('length'),
            lastHistoryTracks = [];

        historyTrackIds.forEach(function(trackId, index) {
            if (length <= lastHistoryTracksLimit || length - lastHistoryTracksLimit >= index) {
                lastHistoryTracks.pushObject(store.peekRecord('track', trackId));
            }
        });

        return lastHistoryTracks;
    }),
    relatedByTracks: Ember.computed('sortedLastHistoryTracks.[]', function() {
        return this.get('sortedLastHistoryTracks').map(function(historyTrack) {
            var options,
                promise;

            options = {
                relatedVideoId: historyTrack.get('id'),
                maxResults: 50
            };

            promise = this.find('track', options, !this.get('cache').getIsOfflineMode());

            promise = new Ember.RSVP.Promise(function(resolve) {
                this.find('track', options, !this.get('cache').getIsOfflineMode()).then(function(relatedTracks) {
                    resolve(logic.getTopRecords(relatedTracks, 4));
                });
            }.bind(this));

            return Ember.Object.create({
                track: historyTrack,
                relatedTracks: DS.PromiseArray.create({
                    promise: promise
                })
            });
        }.bind(this));
    }),
    sortedLastHistoryTracks: Ember.computed.sort('lastHistoryTracks', function(track, other) {
        return this.sortSnippet(this.get('lastHistoryTracks'), track, other, !this.get('cache').getIsOfflineMode());
    }),
    selectedTracks: Ember.computed('lastHistoryTracks.@each.isSelected', function() {
        var selectedLastHistoryTracks = this.get('lastHistoryTracks').filterBy('isSelected'),
            selectedTracks = [];

        selectedTracks.pushObjects(selectedLastHistoryTracks);

        this.get('relatedByTracks').forEach(function(relatedByTrack) {
            selectedTracks.pushObjects(relatedByTrack.get('relatedTracks').filterBy('isSelected'));
        });

        return selectedTracks;
    }),
    actions: {
        selectAll: function() {
            this.get('lastHistoryTracks').setEach('isSelected', true);

            this.get('relatedByTracks').forEach(function(relatedByTrack) {
                relatedByTrack.get('relatedTracks').setEach('isSelected', true);
            });
        },
        toggleIsSelected: function() {
            this.notifyPropertyChange('selectedTracks');
        }
    }
});
