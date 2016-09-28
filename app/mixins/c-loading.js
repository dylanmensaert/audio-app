import Ember from 'ember';

export default Ember.Mixin.create({
    utils: Ember.inject.service(),
    isDisabled: false,
    disabled: Ember.computed('utils.isBusy', 'isDisabled', function() {
        let disabled;

        if (this.get('utils.isBusy') || this.get('isDisabled')) {
            disabled = true;
        }

        return disabled;
    }),
    isPending: false,
    resolve: function() {
        if (!this.get('isDestroyed')) {
            this.set('isPending', false);
        }

        this.set('utils.isBusy', false);
    },
    setupPending: function() {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (this.get('disabled')) {
                reject();
            } else {
                this.set('isPending', true);
                this.set('utils.isBusy', true);

                Ember.run.later(this, function() {
                    resolve();
                }, 300);
            }
        }.bind(this));
    }
});
