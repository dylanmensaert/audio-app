import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import connection from 'connection';
import searchMixin from 'audio-app/mixins/search';

export default Ember.Mixin.create(searchMixin, {
    isPending: false,
    isLocked: false,
    nextPageToken: null,
    searchOnline: function() {
        return !connection.isMobile();
    },
    models: null,
    updateModels: function() {
        let options = {
            maxResults: logic.maxResults,
            nextPageToken: this.get('nextPageToken')
        };

        this.setOptions(options);

        this.set('latestOptions', options);

        this.find(this.get('type'), options, this.searchOnline()).then(function(promise) {
            if (this.get('latestOptions') === options) {
                this.get('models').pushObjects(promise.toArray());

                this.set('isLocked', false);

                if (!this.get('nextPageToken')) {
                    this.set('isPending', false);
                }
            }
        }.bind(this));
    },
    reset: function() {
        this.set('nextPageToken', null);
        this.set('isPending', false);
        this.set('isLocked', false);
        this.set('models', []);
    },
    start: function() {
        this.set('isPending', true);

        logic.later(this, this.updateModels);
    },
    sortedModels: Ember.computed.sort('models', function(model, other) {
        let models = this.get('models'),
            result = -1;

        if (!connection.isOnline()) {
            result = logic.sortByName(model, other);
        } else if (models.indexOf(model) > models.indexOf(other)) {
            result = 1;
        }

        return result;
    }),
    actions: {
        didScrollToBottom: function() {
            if (!this.set('isLocked') && this.get('nextPageToken')) {
                this.set('isLocked', true);

                this.updateModels();
            }
        }
    }
});
