import Audio from 'audio-app/my-audio/object';

export default function(Application) {
    Application.initializer({
        name: 'audio',
        initialize: function(container, application) {
            application.register('audio:main', Audio);

            application.inject('route', 'audio', 'audio:main');
            application.inject('controller', 'audio', 'audio:main');
        }
    });
}
