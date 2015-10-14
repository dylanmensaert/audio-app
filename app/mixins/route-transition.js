/* global encodeURIComponent: true */
import Ember from 'ember';

export default Ember.Mixin.create({
    cache: Ember.inject.service(),
    currentTransition: null,
    afterModel: function (resolvedModel, transition) {
        this.set('currentTransition', transition);

        this.get('cache.completedTransitions').pushObject(transition);
    },
    deactivate: function () {
        var controller = this.get('controller'),
            currentTransition = this.get('currentTransition'),
            hasCurrentTransition = this.get('cache.completedTransitions').contains(currentTransition),
            queryParams,
            parameterName;

        if (hasCurrentTransition) {
            queryParams = [];
            parameterName = this.get('parameterName');

            currentTransition.intent.url = '/' + currentTransition.targetName.replace(/index/g, '').replace(/\./g, '/');

            if (parameterName) {
                currentTransition.intent.url += currentTransition.params[currentTransition.targetName][parameterName];
            }

            currentTransition.intent.queryParams = {};

            controller.get('queryParams').forEach(function (queryParam) {
                var queryValue = controller.get(queryParam);

                if (queryValue !== undefined && queryValue !== null) {
                    queryParams.addObject(queryParam + '=' + encodeURIComponent(queryValue));

                    currentTransition.intent.queryParams[queryParam] = queryValue;
                }
            });

            if (queryParams.get('length')) {
                currentTransition.intent.url += '?' + queryParams.join('&');
            }
        }
    }
});
