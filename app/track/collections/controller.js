import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import connection from 'connection';

export default Ember.Controller.extend(controllerMixin, {
    collections: Ember.computed('utils.selectedTrackIds', 'collections.@each.trackIds', function() {
        var selectedTrackIds = this.get('utils.selectedTrackIds');

        return this.get('store').peekAll('collection').filter(function(collection) {
            var isSelected,
                isReadOnly = collection.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedTrackIds.every(function(selectedTrackId) {
                    return collection.get('trackIds').contains(selectedTrackId);
                });

                collection.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, !connection.isMobile());
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('utils').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        back: function() {
            let utils = this.get('utils');

            this.get('collections').setEach('isSelected', false);

            utils.get('selectedTrackIds').clear();

            utils.back();
        },
        toggleIsSelected: function(collection) {
            var utils = this.get('utils'),
                selectedTrackIds = utils.get('selectedTrackIds'),
                trackIds = collection.get('trackIds');

            if (collection.get('isSelected')) {
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (!trackIds.contains(selectedTrackId)) {
                        collection.pushTrackById(selectedTrackId);
                    }
                });

                utils.showMessage('Added to collection');
            } else {
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (trackIds.contains(selectedTrackId)) {
                        collection.removeTrackById(selectedTrackIds);
                    }
                });

                utils.showMessage('Removed from collection');
            }
        }
    }
});
