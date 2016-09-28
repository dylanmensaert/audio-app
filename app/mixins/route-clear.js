import Ember from 'ember';
import registerRouteMixin from 'audio-app/mixins/route-register';

export default Ember.Mixin.create(registerRouteMixin, {
    actions: {
        didTransition: function() {
            this.get('utils.history').clear();

            return this._super();
        }
    }
});
