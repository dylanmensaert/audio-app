import Ember from 'ember';

export default Ember.Controller.extend({
    utils: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    model: null,
    actions: {
        play: function() {
            let track = this.get('model');

            this.get('audioRemote').start('track', track);
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

            utils.controllerFor('subscribe').set('tracks', [this.get('model')]);
            utils.transitionToRoute('subscribe');
        }
    }
});
