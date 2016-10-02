import Ember from 'ember';
import searchControllerMixin from 'audio-app/mixins/controller-search';

export default Ember.Controller.extend(searchControllerMixin, {
    type: 'track'
});
