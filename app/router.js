import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    updateTitle: function() {
        this.send('updateTitle', []);
    }.on('didTransition')
});

Router.map(function() {
    this.resource('labels');

    this.resource('queue');
});

export default Router;
