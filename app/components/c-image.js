import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    classNames: ['my-image'],
    src: null,
    updateBackground: Ember.observer('src', function() {
        logic.later(this, function() {
            let src = this.get('src');

            if (!this.get('isDestroyed') && src) {
                this.$().css('background-image', 'url(\'' + src + '\')');
            }
        });
    }),
    didInsertElement: function() {
        this.updateBackground();
    }
});
