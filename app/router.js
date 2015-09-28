import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType,
    updateTitle: function () {
        this.send('updateTitle', []);
    }.on('didTransition')
});

Router.map(function () {
    this.route('recording', function () {
        this.route('list');
        this.route('albums');
    });

    this.route('album', function () {
        this.route('index', {
            path: '/:album_id'
        });

        this.route('list');
        this.route('my');
    });

    this.route('settings');
});

export default Router;
