import Ember from 'ember';
import searchControllerMixin from 'audio-app/mixins/controller-search';

export default Ember.Controller.extend(searchControllerMixin, {
    type: 'collection'
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('collections.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('collections.length'),*/
        /*TODO: Implement another way?*/
});
