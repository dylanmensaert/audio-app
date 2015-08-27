import Ember from 'ember';
import injectAudioPlayer from 'audio-app/audio-player/inject';
import injectFileSystem from 'audio-app/file-system/inject';
import injectCache from 'audio-app/cache/inject';

Ember.onLoad('Ember.Application', function(Application) {
    injectAudioPlayer(Application);
    injectFileSystem(Application);
    injectCache(Application);
});
