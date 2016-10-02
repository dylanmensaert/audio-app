import Ember from 'ember';
import connection from 'connection';

export default Ember.Route.extend({
    fileSystem: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    utils: Ember.inject.service(),
    beforeModel: function() {
        return this.get('fileSystem').forge().then(connection.onReady);
    },
    afterModel: function() {
            let utils = this.get('utils');

            utils.set('transitionToRoute', this.transitionTo.bind(this));

            this.get('audioRemote').connect();

            if (!this.store.peekRecord('collection', 'history').get('trackIds.length')) {
                utils.transitionToRoute('search.tracks');
            }
        }
        // TODO: remove?
        /*   actions: {
 loading: function() {
                    if (this.get('controller')) {
                        this.set('controller.isLoading', true);

                        this.router.one('didTransition', function() {
                            this.set('controller.isLoading', false);
                        }.bind(this));
                    }
                },
        error: function(error) {
            let controller = this.get('controller');

            if (controller) {
                controller.set('error', error);
            }
        }
    }*/
});
