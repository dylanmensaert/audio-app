import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    classNames: ['my-image'],
    src: null,
    updateBackground: Ember.observer('src', function() {
        logic.later(this, function() {
            if (!this.get('isDestroyed')) {
                this.$().css('background-image', 'url(\'' + this.get('src') + '\')');
            }
        });
    }),
    didInsertElement: function() {
        this.updateBackground();
    }
});
