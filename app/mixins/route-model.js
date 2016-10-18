import Ember from 'ember';
import registerRouteMixin from 'audio-app/mixins/route-register';

export default Ember.Mixin.create(registerRouteMixin, {
    type: null,
    model: function(parameters) {
        let modelId = parameters[this.get('type') + '_id'],
            model = this.store.peekRecord(this.get('type'), modelId);

        if (!model) {
            model = this.store.findRecord(this.get('type'), modelId);
        }

        return model;
    }
});
