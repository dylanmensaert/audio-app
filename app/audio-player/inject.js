import AudioPlayer from 'audio-app/audio-player/object';

export default function(Application) {
    Application.initializer({
        name: 'audioPlayer',
        initialize: function(container, application) {
            application.register('audioPlayer:main', AudioPlayer);

            application.inject('route', 'audioPlayer', 'audioPlayer:main');
            application.inject('controller', 'audioPlayer', 'audioPlayer:main');
        }
    });
}
