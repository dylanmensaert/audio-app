import Ember from 'ember';
import clickMixin from 'audio-app/mixins/c-click';

export default Ember.Mixin.create(clickMixin, {
    utils: Ember.inject.service(),
    route: null,
    model: null,
    queryParams: null,
    onClick: function () {
        let queryParams = this.get('queryParams'),
            model = this.get('model'),
            parameters;

        parameters = [
            this.get('route')
        ];

        if (model) {
            parameters.pushObject(model);
        }

        if (queryParams) {
            parameters.pushObject({
                queryParams: queryParams
            });
        }

        this.get('utils').transitionToRoute.apply(null, parameters);

        this.resolve();
    }
});
