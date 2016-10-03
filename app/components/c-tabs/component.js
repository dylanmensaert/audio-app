import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(safeStyleMixin, {
    didInsertElement: function() {
        this.$('ul.tabs').tabs();
    }
});
