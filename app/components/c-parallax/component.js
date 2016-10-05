import Ember from 'ember';

export default Ember.Component.extend({
    src: null,
    didInsertElement: function() {
        Ember.$(window).scroll(function() {
            let menuHeight = 56,
                image = this.$('.my-image'),
                display = Ember.$(window),
                height = this.$().height(),
                displayScollTop = display.scrollTop(),
                imageOffset = this.$().offset().top,
                overlappingTopHeight = displayScollTop - menuHeight + display.height() - imageOffset,
                overlappingBottomHeight = imageOffset + height - displayScollTop - menuHeight,
                overlappingHeight = 0;

            if (overlappingTopHeight > 0 && overlappingBottomHeight > 0) {
                let calcHeight = function(givenHeight) {
                    return 100 - (givenHeight / height * 100);
                };

                if (overlappingTopHeight < height) {
                    overlappingHeight = -calcHeight(overlappingTopHeight);
                } else if (overlappingBottomHeight < height) {
                    overlappingHeight = calcHeight(overlappingBottomHeight);
                }
            }

            image.css('background-position-y', (50 - overlappingHeight) + '%');
        }.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).off('scroll');
    }
});
