import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('search', function() {
        this.route('tracks');
        this.route('collections');
    });

    this.route('collection', {
        path: '/:collection_id'
    });

    this.route('collections');

    this.route('settings');
});

export default Router;
