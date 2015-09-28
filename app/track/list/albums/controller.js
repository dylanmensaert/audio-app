import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';

export default Ember.Controller.extend(controllerMixin, {
    collections: function () {
        var selectedSnippetIds = this.get('cache.selectedSnippetIds');

        return this.get('store').peekAll('collection').filter(function (collection) {
            var isSelected,
                isReadOnly = collection.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedSnippetIds.every(function (selectedSnippetId) {
                    return collection.get('trackIds').contains(selectedSnippetId);
                });

                collection.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }.property('cache.selectedSnippetIds', 'collections.@each.trackIds.[]'),
    sortedCollections: Ember.computed.sort('collections', function (snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, !this.get('cache.searchDownloadedOnly'));
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
            this.get('cache.selectedSnippetIds').clear();

            return false;
        },
        toggleIsSelected: function (collection) {
            var cache = this.get('cache'),
                selectedSnippetIds = cache.get('selectedSnippetIds'),
                trackIds = collection.get('trackIds');

            if (collection.get('isSelected')) {
                selectedSnippetIds.forEach(function (selectedSnippetId) {
                    if (!trackIds.contains(selectedSnippetId)) {
                        trackIds.pushObject(selectedSnippetId);
                    }
                });

                cache.showMessage('Added to label');
            } else {
                collection.removeObjects(selectedSnippetIds);

                cache.showMessage('Removed from label');
            }
        }
    }
});
