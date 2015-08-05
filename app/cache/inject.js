import Cache from 'my-app/cache/object';

export default function(Application) {
    Application.initializer({
        name: 'cache',
        initialize: function(container, application) {
            application.register('cache:main', Cache);

            application.inject('route', 'cache', 'cache:main');
            application.inject('controller', 'cache', 'cache:main');
        }
    });
}
