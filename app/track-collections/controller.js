import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import connection from 'connection';

export default Ember.Controller.extend(findControllerMixin, {
    collections: Ember.computed('utils.selectedTrackIds', 'collections.@each.trackIds', function() {
        let selectedTrackIds = this.get('utils.selectedTrackIds');

        return this.get('store').peekAll('collection').filter(function(collection) {
            let isSelected,
                isReadOnly = collection.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedTrackIds.every(function(selectedTrackId) {
                    return collection.get('trackIds').includes(selectedTrackId);
                });

                collection.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }),
    sortedCollections: Ember.computed.sort('collections', function(snippet, other) {
        return this.sort(this.get('collections'), snippet, other, !connection.isMobile());
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
        changeSelect: function(collection) {
            let utils = this.get('utils'),
                selectedTrackIds = utils.get('selectedTrackIds'),
                trackIds = collection.get('trackIds');

            if (collection.get('isSelected')) {
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (!trackIds.includes(selectedTrackId)) {
                        collection.pushTrackById(selectedTrackId);
                    }
                });

                utils.showMessage('Added to collection');
            } else {
                selectedTrackIds.forEach(function(selectedTrackId) {
                    if (trackIds.includes(selectedTrackId)) {
                        collection.removeTrackById(selectedTrackIds);
                    }
                });

                utils.showMessage('Removed from collection');
            }
        }
    }
});
