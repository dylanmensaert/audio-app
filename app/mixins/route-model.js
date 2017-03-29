import Ember from 'ember';
import resetScrollMixin from 'audio-app/mixins/reset-scroll';

export default Ember.Mixin.create(resetScrollMixin, {
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
