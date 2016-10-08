import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(safeStyleMixin, {
    tagName: 'ul',
    classNames: ['tabs'],
    didInsertElement: function() {
        this.$().tabs();
    }
});
