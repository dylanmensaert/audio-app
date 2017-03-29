import Ember from 'ember';
import loadNextControllerMixin from 'audio-app/mixins/controller-load-next';
import searchMixin from 'audio-app/mixins/search';
import connection from 'connection';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create(loadNextControllerMixin, searchMixin, {
    search: Ember.inject.controller(),
    models: null,
    canLoadNext: Ember.computed.alias('hasNextPageToken'),
    loadNext: function() {
        let options = {
            query: this.get('search.query')
        };

        return this.find(this.get('type'), options).then(function(models) {
            this.get('models').pushObjects(models);
        }.bind(this));
    },
    application: Ember.inject.controller(),
    reset: Ember.observer('search.query', function() {
        if (this.get('application.currentRouteName') === this.get('target.currentRouteName')) {
            this.setProperties({
                nextPageToken: undefined,
                isLocked: false,
                models: []
            });

            if (!Ember.isNone(this.get('search.query'))) {
                this.tryLoadNext();
            }
        }
    }),
    sortedModels: Ember.computed.sort('models', function(model, other) {
        let models = this.get('models'),
            result = -1;

        if (!connection.getIsOnline()) {
            result = logic.sortByName(model, other);
        } else if (models.indexOf(model) > models.indexOf(other)) {
            result = 1;
        }

        return result;
    })
});
