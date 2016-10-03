import Ember from 'ember';
import searchControllerMixin from 'audio-app/mixins/controller-search';

export default Ember.Controller.extend(searchControllerMixin, {
    type: 'playlist'
        // TODO: Implement - avoid triggering on init?
        /*updateMessage: function() {
            if (!this.get('playlists.length')) {
                this.get('utils').showMessage('No songs found');
            }
        }.observes('playlists.length'),*/
        /*TODO: Implement another way?*/
});
