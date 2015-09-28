import Ember from 'ember';
import controllerMixin from 'audio-app/mixins/controller';
import collectionActionsMixin from 'audio-app/collection/actions-mixin';

export default Ember.Controller.extend(controllerMixin, collectionActionsMixin, {
    collections: function () {
        return this.get('store').peekAll('collection');
    }.property('collections.[]'),
    sortedCollections: Ember.computed.sort('collections', function (snippet, other) {
        return this.sortSnippet(this.get('collections'), snippet, other, false);
    }),
    selectedCollections: function () {
        return this.get('store').peekAll('collection').filterBy('isSelected');
    }.property('collections.@each.isSelected'),
    // TODO: Implement - avoid triggering on init?
    /*updateMessage: function() {
        if (!this.get('collections.length')) {
            this.get('cache').showMessage('No songs found');
        }
    }.observes('collections.length'),*/
    /*TODO: Implement another way?*/
    actions: {
        selectAll: function () {
            this.get('collections').setEach('isSelected', true);
        }
    }
});