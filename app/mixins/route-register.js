import Ember from 'ember';

export default Ember.Mixin.create({
    utils: Ember.inject.service(),
    actions: {
        didTransition: function() {
            let model = this.controller.get('model'),
                parameters = this.controller.get('queryParams'),
                routeName = this.get('routeName'),
                transition = [routeName],
                history = this.get('utils.history');

            if (model) {
                transition.pushObject(model);
            }

            if (parameters) {
                let query;

                parameters.forEach(function(parameter) {
                    let value = this.controller.get(parameter);

                    if (!Ember.isNone(value)) {
                        if (!query) {
                            query = {};
                        }

                        query[parameter] = value;
                    }
                }.bind(this));

                if (query) {
                    transition.pushObject({
                        queryParams: query
                    });
                }
            }

            if (history.get('lastObject.firstObject') !== routeName) {
                history.pushObject(transition);
            }

            return true;
        }
    }
});
