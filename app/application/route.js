import Ember from 'ember';
import cordova from 'cordova';
import connection from 'connection';

export default Ember.Route.extend({
    fileSystem: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    utils: Ember.inject.service(),
    beforeModel: function() {
        return cordova.onDeviceReady.then(function() {
            return this.get('fileSystem').forge();
        }.bind(this));
    },
    afterModel: function() {
        this.set('utils.transitionToRoute', this.transitionTo.bind(this));
        this.set('utils.controllerFor', this.controllerFor.bind(this));

        this.get('audioRemote').connect();

        connection.on('wifi', function() {
            let downloadLater = this.store.peekRecord('playlist', 'download-later'),
                trackIds = downloadLater.get('trackIds');

            trackIds.toArray().forEach(function(trackId) {
                let track = this.store.peekRecord('track', trackId);

                track.download();
            }.bind(this));
        }.bind(this));

        Ember.$('.my-splash-spinner').remove();
    }
});
