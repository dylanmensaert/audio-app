import Ember from 'ember';
import logic from 'audio-app/utils/logic';
import connection from 'connection';
import searchMixin from 'audio-app/mixins/search';

export default Ember.Mixin.create(searchMixin, {
    isPending: true,
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

        this.find(this.get('type'), options, this.searchOnline()).then(function(promise) {
            this.get('models').pushObjects(promise.toArray());

            Ember.run.scheduleOnce('afterRender', this, function() {
                this.set('isLocked', false);
            });

            if (!this.get('nextPageToken')) {
                this.set('isPending', false);
            }
        }.bind(this));
    },
    reset: function() {
        this.set('nextPageToken', null);
        this.set('isPending', true);
        this.set('isLocked', false);
        this.set('models', []);
    },
    sortedModels: Ember.computed.sort('models', function(model, other) {
        let models = this.get('models'),
            result = -1;

        if (!connection.isMobile()) {
            result = logic.sortByName(model, other);
        } else if (models.indexOf(model) > models.indexOf(other)) {
            result = 1;
        }
    }),
    actions: {
        didScrollToBottom: function() {
            if (!this.get('isLocked') && this.get('nextPageToken')) {
                this.set('isLocked', true);

                this.updateModels();
            }
        }
    }
});
