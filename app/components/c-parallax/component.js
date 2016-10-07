import Ember from 'ember';
import logic from 'audio-app/utils/logic';

export default Ember.Component.extend({
    src: null,
    didInsertElement: function() {
        Ember.$(window).scroll(function() {
            let image = this.$('.my-image'),
                height = this.$().height(),
                overlay = logic.getWindowOverlayWith(this.$()),
                overlayHeight = 0;

            if (overlay.isVisible) {
                let calcHeight = function(givenHeight) {
                    return 100 - (givenHeight / height * 100);
                };

                if (overlay.topHeight < height) {
                    overlayHeight = -calcHeight(overlay.topHeight);
                } else if (overlay.bottomHeight < height) {
                    overlayHeight = calcHeight(overlay.bottomHeight);
                }
            }

            image.css('background-position-y', (50 - overlayHeight) + '%');
        }.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).off('scroll');
    }
});
