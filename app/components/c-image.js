import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    classNames: ['my-image'],
    src: null,
    updateBackground: Ember.observer('src', function() {
        logic.later(this, function() {
            let element = this.$(),
                src = this.get('src');

            if (element && src) {
                element.css('background-image', 'url(\'' + src + '\')');
            }
        });
    }),
    didInsertElement: function() {
        this.updateBackground();
    }
});
