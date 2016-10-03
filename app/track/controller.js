import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';

export default Ember.Controller.extend(findControllerMixin, {
    type: 'track',
    model: null,
    setOptions: function(options) {
        options.relatedVideoId = this.get('model.id');
    }
});
