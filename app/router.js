import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    updateTitle: function() {
        this.send('updateTitle', []);
    }.on('didTransition')
});

Router.map(function() {
    this.resource('albums');

    this.resource('queue');

    this.resource('settings');
});

export default Router;
