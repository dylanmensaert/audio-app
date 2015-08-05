import Ember from 'ember';
import updateTitle from 'my-app/utils/update-title';

export default Ember.Route.extend(updateTitle, {
    title: 'Queue'
});
