import Ember from 'ember';

export default Ember.Component.extend({
    audioPlayer: null,
    actions: {
        transitionToQueue: function () {
            this.sendAction('transitionTo', 'album/queue');
        },
        play: function () {
            this.sendAction('play');
        },
        pause: function () {
            this.sendAction('pause');
        }
    }
});
