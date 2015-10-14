import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';

export default Ember.Controller.extend(controllerMixin, {
    collections: function () {
        var selectedTrackIds = this.get('cache.selectedTrackIds');

        return this.get('store').peekAll('collection').filter(function (collection) {
            var isSelected,
                isReadOnly = collection.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedTrackIds.every(function (selectedTrackId) {
                    return collection.get('trackIds').contains(selectedTrackId);
                });

                collection.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }.property('cache.selectedTrackIds', 'collections.@each.trackIds.[]'),
    sortedCollections: Ember.computed.sort('collections', function (snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, !this.get('cache').getIsOfflineMode());
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        transitionToPrevious: function () {
            this.get('collections').setEach('isSelected', false);

            this.get('cache.selectedTrackIds').clear();

            return true;
        },
        toggleIsSelected: function (collection) {
            var cache = this.get('cache'),
                selectedTrackIds = cache.get('selectedTrackIds'),
                trackIds = collection.get('trackIds');

            if (collection.get('isSelected')) {
                selectedTrackIds.forEach(function (selectedTrackId) {
                    if (!trackIds.contains(selectedTrackId)) {
                        collection.pushTrackById(selectedTrackId);
                    }
                });

                cache.showMessage('Added to collection');
            } else {
                selectedTrackIds.forEach(function (selectedTrackId) {
                    if (trackIds.contains(selectedTrackId)) {
                        collection.removeTrackById(selectedTrackIds);
                    }
                });

                cache.showMessage('Removed from collection');
            }
        }
    }
});
