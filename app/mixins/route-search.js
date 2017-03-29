import Ember from 'ember';
import resetScrollMixin from 'audio-app/mixins/reset-scroll';

export default Ember.Mixin.create(resetScrollMixin, {
    actions: {
        didTransition: function() {
            this.controller.reset();
        }
    }
});
