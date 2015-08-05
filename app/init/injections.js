import Ember from 'ember';
import injectAudio from 'my-app/audio/inject';
import injectFileSystem from 'my-app/file-system/inject';
import injectCache from 'my-app/cache/inject';

Ember.onLoad('Ember.Application', function(Application) {
    injectAudio(Application);
    injectFileSystem(Application);
    injectCache(Application);
});
