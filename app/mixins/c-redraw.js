import Ember from 'ember';

export default Ember.Mixin.create({
    redraw: Ember.observer('disabled', function() {
        Ember.run.later(this, function() {
            if (!this.get('isDestroyed')) {
                this.$().hide().show(0);
            }
        }, 300);
    })
});
