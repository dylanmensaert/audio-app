import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.store.peekRecord('playlist', 'queue');
    },
    setupController: function(controller, model) {
        let store = this.store,
            tracks;

        tracks = model.get('trackIds').map(function(trackId) {
            return store.peekRecord('track', trackId);
        });

        controller.set('tracks', tracks);

        this._super(controller, model);
    }
});
