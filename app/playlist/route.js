import Ember from 'ember';
import clearRouteMixin from 'audio-app/mixins/route-clear';

export default Ember.Route.extend(clearRouteMixin, {
    setupController: function(controller, model) {
            controller.reset();

            this._super(controller, model);
        }
        // TODO: should work out of the box via findRecord: http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_better-caching-defaults-for-code-findall-code-and-code-findrecord-code
        // However, the documentation does not seem to work in this case
        /*queryParams: {
            playlist_id: {
                refreshModel: true
            }
        },
        model: function(parameters) {
            let playlistId = parameters.playlist_id,
                store = this.get('store'),
                playlist = store.peekRecord('playlist', playlistId);

            if (!playlist) {
                playlist = store.findRecord('playlist', playlistId);
            }

            return playlist;
        }*/
});
