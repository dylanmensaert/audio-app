import Ember from 'ember';
import updateTitle from 'audio-app/utils/update-title';

export default Ember.Route.extend(updateTitle, {
    title: 'Album'
});
