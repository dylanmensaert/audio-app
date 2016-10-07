import Ember from 'ember';
import backRouteMixin from 'audio-app/mixins/route-back';

export default Ember.Mixin.create(backRouteMixin, {
    type: null,
    setupController: function(controller, model) {
        this._super(controller, model);

        controller.reset();
        controller.start();
    },
    model: function(parameters) {
        let modelId = parameters[this.get('type') + '_id'],
            model = this.store.peekRecord(this.get('type'), modelId);

        if (!model) {
            model = this.store.findRecord(this.get('type'), modelId);
        }

        return model;
    }
});
