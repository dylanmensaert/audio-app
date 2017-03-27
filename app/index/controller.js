import Ember from 'ember';
import DS from 'ember-data';
import searchMixin from 'audio-app/mixins/search';
import logic from 'audio-app/utils/logic';
import trackActionsMixin from 'audio-app/mixins/actions-track';

const relatedTracksLimit = 4;

export default Ember.Controller.extend(searchMixin, trackActionsMixin, {
    lastHistoryTracks: null,
    relatedTracks: null,
    relatedByTracks: Ember.computed('lastHistoryTracks.[]', function() {
        let lastHistoryTracks = this.get('lastHistoryTracks'),
            shownTrackIds = [],
            promises,
            promise;

        promises = lastHistoryTracks.map(function(historyTrack) {
            let options = {
                relatedVideoId: historyTrack.get('id'),
                maxResults: logic.maxResults
            };

            shownTrackIds.pushObject(historyTrack.get('id'));

            return this.find('track', options).then(function(relatedTracks) {
                return logic.findDetails(relatedTracks);
            }).then(function(relatedTracks) {
                return Ember.Object.extend({
                    // TODO: Youtube API, viewCount not working in combination with relatedVideoId
                    trackSorting: ['viewCount:desc'],
                    sortedRelatedTracks: Ember.computed.sort('relatedTracks', 'trackSorting'),
                    selectedRelatedTracks: Ember.computed.filterBy('relatedTracks', 'isSelected', true),
                    numberOfSelections: Ember.computed('selectedRelatedTracks.length', function() {
                        return this.get('selectedRelatedTracks.length');
                    })
                }).create({
                    track: historyTrack,
                    relatedTracks: relatedTracks
                });
            });
        }.bind(this));

        promise = Ember.RSVP.all(promises).then(function(relatedByTracks) {
            relatedByTracks.forEach(function(relatedByTrack) {
                let relatedTracks = relatedByTrack.get('sortedRelatedTracks'),
                    topTracks = [];

                relatedTracks.any(function(track) {
                    let id = track.get('id');

                    if (!shownTrackIds.includes(id)) {
                        topTracks.pushObject(track);

                        shownTrackIds.pushObject(id);
                    }

                    return topTracks.get('length') === relatedTracksLimit;
                });

                relatedByTrack.set('relatedTracks', topTracks);
            });

            return relatedByTracks;
        });

        return DS.PromiseArray.create({
            promise: promise
        });
    }),
    selectedTracks: Ember.computed('lastHistoryTracks.@each.isSelected', 'relatedByTracks.@each.numberOfSelections', function() {
        let selectedLastHistoryTracks = this.get('lastHistoryTracks').filterBy('isSelected'),
            selectedTracks = [];

        selectedTracks.pushObjects(selectedLastHistoryTracks);

        this.get('relatedByTracks').forEach(function(relatedByTrack) {
            // TODO: workaround to trigger numberOfSelections
            relatedByTrack.get('numberOfSelections');

            selectedTracks.pushObjects(relatedByTrack.get('selectedRelatedTracks'));
        });

        return selectedTracks;
    })
});
