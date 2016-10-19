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

        connection.onMobile(function() {
            let downloadLater = this.store.peekRecord('playlist', 'download-later'),
                trackIds = downloadLater.get('trackIds');

            trackIds.toArray().forEach(function(trackId) {
                let track = this.store.peekRecord('track', trackId);

                trackIds.removeObject(trackId);

                track.download();
            }.bind(this));
        }.bind(this));

        if (!this.store.peekRecord('playlist', 'history').get('trackIds.length')) {
            utils.transitionToRoute('search.tracks');
        }
    },
    actions: {
        back: function() {
            this.get('utils').back(false);
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
