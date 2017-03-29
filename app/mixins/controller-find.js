import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import connection from 'connection';
import searchMixin from 'audio-app/mixins/search';

export default Ember.Mixin.create(searchMixin, {
    has: false,
    isLocked: false,
    connection: connection,
    isPending: Ember.computed('connection.isOnline', 'hasNextPageToken', function() {
        return this.get('connection.isOnline') && this.get('hasNextPageToken');
    }),
    models: null,
    afterUpdate: function() {
        return Ember.RSVP.resolve();
    },
    updateModels: function() {
        let options = {
            maxResults: logic.maxResults,
            nextPageToken: this.get('nextPageToken')
        };

        this.setOptions(options);

        this.set('latestOptions', options);

        return this.find(this.get('type'), options).then(function(promiseArray) {
            let promise;

            if (this.get('latestOptions') === options) {
                let models = promiseArray.toArray();

                promise = this.afterUpdate(models).then(function() {
                    this.get('models').pushObjects(models);

                    this.set('isLocked', false);
                }.bind(this));
            }

            return promise;
        }.bind(this));
    },
    reset: function() {
        this.setProperties({
            nextPageToken: undefined,
            isLocked: false,
            models: []
        });
    },
    start: function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            logic.later(function() {
                this.updateModels().then(resolve, reject);
            }.bind(this));
        }.bind(this));
    },
    sortedModels: Ember.computed.sort('models', function(model, other) {
        let models = this.get('models'),
            result = -1;

        if (!connection.getIsOnline()) {
            result = logic.sortByName(model, other);
        } else if (models.indexOf(model) > models.indexOf(other)) {
            result = 1;
        }

        return result;
    }),
    actions: {
        didScrollToBottom: function() {
            if (!this.set('isLocked') && this.get('isPending')) {
                this.set('isLocked', true);

                this.updateModels();
            }
        }
    }
});
