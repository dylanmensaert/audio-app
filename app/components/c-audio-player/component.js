import Ember from 'ember';

export default Ember.Component.extend({
    audioPlayer: null,
    actions: {
        play: function() {
            this.sendAction('play');
        },
        pause: function() {
            this.sendAction('pause');
        }
    }
});
