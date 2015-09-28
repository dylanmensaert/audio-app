import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';

export default Ember.Controller.extend(controllerMixin, {
    albums: function() {
        var selectedSnippetIds = this.get('cache.selectedSnippetIds');

        return this.get('store').peekAll('album').filter(function(album) {
            var isSelected,
                isReadOnly = album.get('isReadOnly');

            if (!isReadOnly) {
                isSelected = selectedSnippetIds.every(function(selectedSnippetId) {
                    return album.get('recordingIds').contains(selectedSnippetId);
                });

                album.set('isSelected', isSelected);
            }

            return !isReadOnly;
        });
    }.property('cache.selectedSnippetIds', 'albums.@each.recordingIds.[]'),
    sortedAlbums: Ember.computed.sort('albums', function(snippet, other) {
        return this.sortSnippet(this.get('albums'), snippet, other, !this.get('cache.searchDownloadedOnly'));
    }),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('albums.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('albums.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        transitionToPrevious: function() {
            this.get('cache.selectedSnippetIds').clear();

            return false;
        },
        toggleIsSelected: function(album) {
            var cache = this.get('cache'),
                selectedSnippetIds = cache.get('selectedSnippetIds'),
                recordingIds = album.get('recordingIds');

            if (album.get('isSelected')) {
                selectedSnippetIds.forEach(function(selectedSnippetId) {
                    if (!recordingIds.contains(selectedSnippetId)) {
                        recordingIds.pushObject(selectedSnippetId);
                    }
                });

                cache.showMessage('Added to label');
            } else {
                album.removeObjects(selectedSnippetIds);

                cache.showMessage('Removed from label');
            }
        }
    }
});
