import Ember from 'ember';
import DS from 'ember-data';
import searchMixin from 'audio-app/mixins/search';
import logic from 'audio-app/utils/logic';
import connection from 'connection';

export default Ember.Controller.extend(searchMixin, {
    // TODO: remove duplicate tracks shown
    lastHistoryTracks: null,
    isPending: Ember.computed('relatedByTracks.@each.isPending', function() {
        return this.get('relatedByTracks').isAny('isPending');
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

            return Ember.Object.extend({
                isPending: Ember.computed.alias('relatedTracks.isPending')
            }).create({
                track: historyTrack,
                relatedTracks: DS.PromiseArray.create({
                    promise: promise
                })
            });
        }.bind(this));
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
