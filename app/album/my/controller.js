import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import albumActionsMixin from 'audio-app/album/actions-mixin';

export default Ember.Controller.extend(controllerMixin, albumActionsMixin, {
    albums: function () {
        return this.get('store').peekAll('album');
    }.property('albums.[]'),
    sortedAlbums: Ember.computed.sort('albums', function (snippet, other) {
        return this.sortSnippet(this.get('albums'), snippet, other, false);
    }),
    selectedAlbums: function () {
        return this.get('store').peekAll('album').filterBy('isSelected');
    }.property('albums.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('albums.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('albums.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function () {
            this.get('albums').setEach('isSelected', true);
        }
    }
});
