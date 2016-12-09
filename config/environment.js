/* jshint node: true */

module.exports = function(environment) {
    var ENV = {
            contentSecurityPolicy: {
                'style-src': "'self' 'unsafe-inline'",
                'media-src': "'self' *.aclst.com",
                'connect-src': "'self' *.aclst.com"
            },
            modulePrefix: 'audio-app',
            environment: environment,
            locationType: 'auto',
            EmberENV: {
                FEATURES: {
                    // Here you can enable experimental features on an ember canary build
                    // e.g. 'with-controller': true
                },
                EXTEND_PROTOTYPES: {
                    // Prevent Ember Data from overriding Date.parse.
                    Date: false
                }
            },

            APP: {
                // Here you can pass flags/options to your application instance
                // when it is created
            }
        },
        baseURL;

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {
        baseURL = 'file:///android_asset/www/';

        ENV.locationType = 'none';
        ENV.baseURL = baseURL;
        ENV.APP.baseURL = baseURL;
    }

    return ENV;
};
