import Ember from 'ember';
import resetScrollMixin from 'audio-app/mixins/reset-scroll';

export default Ember.Route.extend(resetScrollMixin, {
    model: function() {
        return this.store.peekRecord('playlist', 'queue');
    }
});
