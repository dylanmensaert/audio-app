import Ember from 'ember';
import clearRouteMixin from 'audio-app/mixins/route-clear';

export default Ember.Route.extend(clearRouteMixin, {
    utils: Ember.inject.service(),
    beforeModel: function() {
        if (!this.store.peekRecord('playlist', 'history').get('trackIds.length')) {
            this.transitionTo('search.tracks');
        }
    }
});
