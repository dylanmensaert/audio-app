import Ember from 'ember';
import modelRouteMixin from 'audio-app/mixins/route-model';

export default Ember.Route.extend(modelRouteMixin, {
    type: 'playlist',
    setupController: function(controller, model) {
        this._super(controller, model);

        if (!model.get('isLocalOnly') && model.get('nextPageToken') === undefined) {
            model.loadNextTracks();
        }

        controller.updateTracks();
        this.set('tracks', model.get('tracks'));
    }
});
