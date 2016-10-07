import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';

export default Ember.Controller.extend(findControllerMixin, {
    model: null,
    type: 'track',
    setOptions: function(options) {
        options.relatedVideoId = this.get('model.id');
    }
});
