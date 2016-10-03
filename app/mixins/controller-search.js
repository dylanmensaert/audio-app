import Ember from 'ember';
import findControllerMixin from 'audio-app/mixins/controller-find';
import logic from 'audio-app/utils/logic';

export default Ember.Mixin.create(findControllerMixin, {
    init: function() {
        this._super();

        this.resetController();
    },
    search: Ember.inject.controller(),
    application: Ember.inject.controller(),
    setOptions: function(options) {
        options.query = this.get('search.query');
    },
    resetController: Ember.observer('search.query', 'application.currentRouteName', 'target.currentRouteName', function() {
        if (this.get('application.currentRouteName') === this.get('target.currentRouteName')) {
            this.reset();

            if (!Ember.isNone(this.get('search.query'))) {
                this.start();
            }
        }
    })
});
