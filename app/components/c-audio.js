import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'audio',
    audioPlayer: Ember.inject.service(),
    didInsertElement: function() {
        let element = this.get('element'),
            audioPlayer = this.get('audioPlayer'),
            track = audioPlayer.get('track');

        element.addEventListener('durationchange', function(event) {
            audioPlayer.set('duration', event.target.duration);
        });

        element.addEventListener('timeupdate', function(event) {
            audioPlayer.set('currentTime', event.target.currentTime);
        });

        element.addEventListener('abort', function(event) {
            audioPlayer.onError(event);
        });

        element.addEventListener('error', function(event) {
            audioPlayer.onError(event);
        });

        element.addEventListener('loadstart', function() {
            audioPlayer.set('status', 'loading');
        });

        element.addEventListener('canplay', function() {
            let resolve = audioPlayer.get('resolve');

            audioPlayer.set('status', 'idle');

            if (resolve) {
                resolve();
            }
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
        let element = this.get('element');

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
