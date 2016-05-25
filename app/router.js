import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('track', function() {
        this.route('list');
        this.route('collections');
    });

    this.route('collection', function() {
        this.route('index', {
            path: '/:collection_id'
        });

        this.route('list');
        this.route('my');
    });

    this.route('search');

    this.route('settings');
});

export default Router;
