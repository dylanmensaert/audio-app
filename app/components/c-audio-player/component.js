import Ember from 'ember';

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    actions: {
        toggleMode: function () {
            this.toggleProperty('audioPlayer.isLargeMode');
        },
        play: function () {
            this.sendAction('play');
        },
        pause: function () {
            this.sendAction('pause');
        },
        previous: function () {
            this.sendAction('previous');
        },
        next: function () {
            this.sendAction('next');
        }
    }
});
