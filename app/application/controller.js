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
        resume: function() {
            this.get('audioRemote').resume();
        },
        pause: function() {
            this.get('audioRemote').pause();
        },
        previous: function() {
            this.get('audioRemote').previous();
        },
        next: function() {
            this.get('audioRemote').next();
        },
        transitionTo: function() {
            let audioRemote = this.get('audioRemote');

            Ember.$('#audio-player').modal('close');
            this.transitionToRoute(audioRemote.get('routeName'), audioRemote.get('model'));
        },
        didInsertModal: function() {
            Ember.$('#audio-player').modal();
        }
    }
});
