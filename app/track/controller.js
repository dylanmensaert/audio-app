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
            this.get('model').remove();
        },
        queue: function() {
            this.store.peekRecord('playlist', 'queue').get('trackIds').addObject(this.get('model.id'));

            this.get('utils').showMessage('Added to queue');
        },
        transitionToPlaylists: function() {
            let utils = this.get('utils');

            utils.set('selectedTrackIds', [this.get('model.id')]);

            utils.transitionToRoute('subscribe');
        }
    }
});
