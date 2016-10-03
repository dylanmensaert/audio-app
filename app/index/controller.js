import Ember from 'ember';
import DS from 'ember-data';
import findControllerMixin from 'audio-app/mixins/controller-find';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

const lastHistoryTracksLimit = 8;

export default Ember.Controller.extend(findControllerMixin, {
    showNotFound: Ember.computed('lastHistoryTracks.isPending', 'lastHistoryTracks.length', 'lastHistoryTracks.length', function() {
        return !this.get('lastHistoryTracks.isPending') && !this.get('lastHistoryTracks.length') && !this.get('lastHistoryTracks.length');
    }),
    lastHistoryTracks: Ember.computed('collections.@each.trackIds', function() {
        let store = this.get('store'),
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
            let options,
                promise;

            options = {
                relatedVideoId: historyTrack.get('id'),
                maxResults: logic.maxResults
            };

            promise = this.find('track', options, !connection.isMobile());

            promise = new Ember.RSVP.Promise(function(resolve) {
                this.find('track', options, !connection.isMobile()).then(function(relatedTracks) {
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
        return this.sort(this.get('lastHistoryTracks'), track, other, !connection.isMobile());
    }),
    selectedTracks: Ember.computed('lastHistoryTracks.@each.isSelected', function() {
        let selectedLastHistoryTracks = this.get('lastHistoryTracks').filterBy('isSelected'),
            selectedTracks = [];

        selectedTracks.pushObjects(selectedLastHistoryTracks);

        this.get('relatedByTracks').forEach(function(relatedByTrack) {
            selectedTracks.pushObjects(relatedByTrack.get('relatedTracks').filterBy('isSelected'));
        });

        return selectedTracks;
    }),
    actions: {
        changeSelect: function() {
            this.notifyPropertyChange('selectedTracks');
        }
    }
});
