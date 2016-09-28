import Ember from 'ember';

var errors = Ember.Map.create();

errors.set(1, 'Fetching process aborted by user');
errors.set(2, 'Error occurred when downloading');
errors.set(3, 'Error occurred when decoding');
errors.set(4, 'Audio not supported');

export default Ember.Component.extend({
    tagName: 'audio',
    audioPlayer: Ember.inject.service(),
    didInsertElement: function() {
        var element = this.get('element'),
            audioPlayer = this.get('audioPlayer'),
            track = audioPlayer.get('track');

        element.addEventListener('durationchange', function(event) {
            audioPlayer.set('duration', event.target.duration);
        });

        element.addEventListener('timeupdate', function(event) {
            audioPlayer.set('currentTime', event.target.currentTime);
        });

        element.addEventListener('abort', function(event) {
            Ember.RSVP.reject(errors.get(event.target.error.code));

            audioPlayer.set('status', 'idle');
        });

        element.addEventListener('error', function(event) {
            // TODO: Show errors via utils.showMessage?
            Ember.RSVP.reject(errors.get(event.target.error.code));

            audioPlayer.set('status', 'idle');
        });

        element.addEventListener('loadstart', function() {
            audioPlayer.set('status', 'loading');
        });

        element.addEventListener('canplay', function() {
            audioPlayer.set('status', 'idle');
        });

        element.addEventListener('waiting', function() {
            audioPlayer.set('status', 'loading');
        });

        element.addEventListener('pause', function() {
            audioPlayer.set('status', 'idle');
        });

        element.addEventListener('playing', function() {
            audioPlayer.set('status', 'playing');
        });

        element.addEventListener('ended', function() {
            audioPlayer.set('status', 'idle');

            audioPlayer.didEnd();
        });

        audioPlayer.set('element', element);

        if (track) {
            audioPlayer.load(track);
        }
    },
    willDestroyElement: function() {
        var element = this.get('element');

        element.removeEventListener('durationchange');
        element.removeEventListener('timeupdate');
        element.removeEventListener('abort');
        element.removeEventListener('error');
        element.removeEventListener('loadstart');
        element.removeEventListener('canplay');
        element.removeEventListener('waiting');
        element.removeEventListener('pause');
        element.removeEventListener('playing');
        element.removeEventListener('ended');
        element.removeEventListener('canplaythrough');

        this.set('audioPlayer.element', null);
    }
});
