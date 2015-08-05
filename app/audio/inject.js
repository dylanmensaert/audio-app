import Audio from 'my-app/audio/object';

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
