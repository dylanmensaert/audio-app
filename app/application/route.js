/*global history*/
import Ember from 'ember';
import connection from 'connection';
import phonegap from 'phonegap';

export default Ember.Route.extend({
    fileSystem: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    utils: Ember.inject.service(),
    beforeModel: function() {
        return phonegap.get('onDeviceReady').then(function() {
            return this.get('fileSystem').forge();
        }.bind(this));
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

        Ember.$('.my-splash-spinner').remove();
    },
    actions: {
        back: function() {
            history.back();
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
