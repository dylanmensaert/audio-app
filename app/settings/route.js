import Ember from 'ember';
import updateTitleMixin from 'audio-app/mixins/update-title';

export default Ember.Route.extend(updateTitleMixin, {
    title: 'Settings'
});
