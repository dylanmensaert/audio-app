import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    updateTitle: function () {
        this.send('updateTitle', []);
    }.on('didTransition')
});

Router.map(function () {
    this.route('recordings');

    this.route('albums');
    this.route('album');

    this.route('settings');
});

export default Router;
