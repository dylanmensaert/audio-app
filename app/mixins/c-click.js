import Ember from 'ember';
import loadingMixin from 'audio-app/mixins/c-loading';
import redrawMixin from 'audio-app/mixins/c-redraw';

export default Ember.Mixin.create(loadingMixin, redrawMixin, {
    attributeBindings: ['disabled'],
    onClick: null,
    click: function() {
        if (!this.get('disabled')) {
            this.setupPending().then(this.onClick.bind(this));
        }
    }
});
