import Ember from 'ember';

export default Ember.Controller.extend({
    utils: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    model: null,
    actions: {
        play: function() {
            this.get('audioRemote').play(this.get('model'));
        },
        download: function() {
            this.get('model').download();
        },
        delete: function() {
            let track = this.get('model');

            track.remove().then(function() {
                return track.destroyRecord();
            });
        },
        queue: function() {
            let queue = this.get('store').peekRecord('playlist', 'queue'),
                trackIds = queue.get('trackIds'),
                track = this.get('model');

            if (!trackIds.includes(track.get('id'))) {
                this.queueSingle(trackIds, track);
            }

            this.get('utils').showMessage('Added to queue');
        },
        transitionToPlaylists: function() {
            let utils = this.get('utils');

            utils.set('selectedTrackIds', this.get('models').mapBy('id'));

            utils.transitionToRoute('track.playlists');
        }
    }
});
