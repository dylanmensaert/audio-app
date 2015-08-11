import Ember from 'ember';
import injectAudio from 'audio-app/audio/inject';
import injectFileSystem from 'audio-app/file-system/inject';
import injectCache from 'audio-app/cache/inject';

Ember.onLoad('Ember.Application', function(Application) {
    injectAudio(Application);
    injectFileSystem(Application);
    injectCache(Application);
});
