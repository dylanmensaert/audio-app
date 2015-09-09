import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    updateTitle: function () {
        this.send('updateTitle', []);
    }.on('didTransition')
});

Router.map(function () {
    this.resource('recordings');

    this.resource('albums');
    this.resource('album');

    this.resource('settings');
});

export default Router;
