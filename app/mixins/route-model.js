import Ember from 'ember';

export default Ember.Mixin.create({
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
