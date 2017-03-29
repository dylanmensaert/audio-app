import Ember from 'ember';
import loadNextControllerMixin from 'audio-app/mixins/controller-load-next';
import searchMixin from 'audio-app/mixins/search';
import connection from 'connection';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create(loadNextControllerMixin, searchMixin, {
    init: function() {
        this._super();

        this.resetController();
    },
    search: Ember.inject.controller(),
    application: Ember.inject.controller(),
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
    reset: function() {
        this.setProperties({
            nextPageToken: undefined,
            isLocked: false,
            models: []
        });
    },
    resetController: Ember.observer('search.query', 'application.currentRouteName', 'target.currentRouteName', function() {
        if (this.get('application.currentRouteName') === this.get('target.currentRouteName')) {
            this.reset();

            if (!Ember.isNone(this.get('search.query'))) {
                this.loadNext();
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
