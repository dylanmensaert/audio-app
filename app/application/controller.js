import Ember from 'ember';

export default Ember.Controller.extend({
    utils: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    audioRemote: Ember.inject.service(),
    isLoading: false,
    linkToProperties: {
        classNameBindings: ['active:mdl-color--blue-grey-800']
    },
    actions: {
        dismissAlert: function() {
            this.set('error', null);
        },
        play: function() {
            this.get('audioRemote').playTrack();
        },
        pause: function() {
            this.get('audioRemote').pause();
        }
    }
});
