import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('search', function() {
        this.route('tracks');
        this.route('playlists');
    });

    this.route('playlist', {
        path: 'playlist/:playlist_id'
    });

    this.route('track', {
        path: 'track/:track_id'
    });

    this.route('playlists');

    this.route('settings');
});

export default Router;
