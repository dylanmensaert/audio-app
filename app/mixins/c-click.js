import Ember from 'ember';
import loadingMixin from 'audio-app/mixins/c-loading';

export default Ember.Mixin.create(loadingMixin, {
    attributeBindings: ['disabled'],
    onClick: null,
    click: function() {
        if (!this.get('disabled')) {
            this.setupPending().then(this.onClick.bind(this));
        }
    }
});
