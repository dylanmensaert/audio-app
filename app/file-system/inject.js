import fileSystem from 'audio-app/file-system/object';

export default function(Application) {
    Application.initializer({
        name: 'fileSystem',
        initialize: function(container, application) {
            application.register('fileSystem:main', fileSystem);

            application.inject('route', 'fileSystem', 'fileSystem:main');
            application.inject('controller', 'fileSystem', 'fileSystem:main');
        }
    });
}
