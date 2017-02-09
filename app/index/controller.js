import Ember from 'ember';
import DS from 'ember-data';
import searchMixin from 'audio-app/mixins/search';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

const relatedTracksLimit = 4;

export default Ember.Controller.extend(searchMixin, {
    // TODO: remove duplicate tracks shown
    lastHistoryTracks: null,
    relatedByTracks: Ember.computed('sortedLastHistoryTracks.[]', function() {
        let sortedLastHistoryTracks = this.get('sortedLastHistoryTracks'),
            shownTrackIds = [],
            promises,
            promise;

        promises = sortedLastHistoryTracks.map(function(historyTrack) {
            let options = {
                relatedVideoId: historyTrack.get('id'),
                maxResults: logic.maxResults
            };

            shownTrackIds.pushObject(historyTrack.get('id'));

            return this.find('track', options, !connection.isMobile()).then(function(relatedTracks) {
                return logic.findDetails(relatedTracks).then(function() {
                    return Ember.Object.extend({
                        trackSorting: ['viewCount:desc'],
                        sortedRelatedTracks: Ember.computed.sort('relatedTracks', 'trackSorting')
                    }).create({
                        track: historyTrack,
                        relatedTracks: relatedTracks
                    });
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
    sortedLastHistoryTracks: Ember.computed.sort('lastHistoryTracks', function(track, other) {
        let models = this.get('lastHistoryTracks'),
            result = -1;

        if (!connection.isMobile()) {
            result = logic.sortByName(track, other);
        } else if (models.indexOf(track) > models.indexOf(other)) {
            result = 1;
        }
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
