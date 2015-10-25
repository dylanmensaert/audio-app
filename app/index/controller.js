import Ember from 'ember';
import DS from 'ember-data';
import controllerMixin from 'audio-app/mixins/controller';
import trackActionsMixin from 'audio-app/track/actions-mixin';
import logic from 'audio-app/utils/logic';

const lastHistoryTracksLimit = 8;

export default Ember.Controller.extend(controllerMixin, trackActionsMixin, {
    showNotFound: function() {
        return !this.get('lastHistoryTracks.isPending') && !this.get('lastHistoryTracks.length') && !this.get('lastHistoryTracks.length');
    }.property('lastHistoryTracks.isPending', 'lastHistoryTracks.length', 'lastHistoryTracks.length'),
    lastHistoryTracks: function() {
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
    }.property('collections.@each.trackIds.[]'),
    relatedByTracks: function() {
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
    }.property('sortedLastHistoryTracks.[]'),
    sortedLastHistoryTracks: Ember.computed.sort('lastHistoryTracks', function(track, other) {
        return this.sortSnippet(this.get('lastHistoryTracks'), track, other, !this.get('cache').getIsOfflineMode());
    }),
    // TODO: not working for some reason
    /*selectedTracks: function() {
        return this.get('store').peekAll('track').filterBy('isSelected');
    }.property('tracks.@each.isSelected'),*/
    // TODO: not working for relatedByTracks
    selectedTracks: function() {
        var selectedLastHistoryTracks = this.get('lastHistoryTracks').filterBy('isSelected'),
            selectedTracks = [];

        selectedTracks.pushObjects(selectedLastHistoryTracks);

        this.get('relatedByTracks').forEach(function(relatedByTrack) {
            selectedTracks.pushObjects(relatedByTrack.get('relatedTracks').filterBy('isSelected'));
        });

        return selectedTracks;
    }.property('lastHistoryTracks.@each.isSelected', 'relatedByTracks.@each.relatedTracks.@each.isSelected'),
    actions: {
        selectAll: function() {
            this.get('lastHistoryTracks').setEach('isSelected', true);

            this.get('relatedByTracks').forEach(function(relatedByTrack) {
                relatedByTrack.get('relatedTracks').setEach('isSelected', true);
            });
        }
    }
});
