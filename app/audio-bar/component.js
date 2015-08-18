import Ember from 'ember';

export default Ember.Component.extend({
    layoutName: 'audio_bar',
    audio: null,
    actions: {
        transitionToQueue: function() {
            this.sendAction('transitionToQueue');
        },
        play: function() {
            this.sendAction('play');
        },
        pause: function() {
            this.sendAction('pause');
        }
    }
});