import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    tagName: 'img',
    classNames: ['my-image'],
    src: null,
    updateBackground: Ember.observer('src', function() {
        logic.later(function() {
            let element = this.$();

            if (element) {
                let src = this.get('src');

                if (src) {
                    element.css('background-image', 'url("' + src + '")');
                } else {
                    element.css('background-image', '');
                }
            }
        }.bind(this));
    }),
    didInsertElement: function() {
        this.updateBackground();
    }
});
