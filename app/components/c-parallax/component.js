import Ember from 'ember';

export default Ember.Component.extend({
    src: null,
    scrollBackGround: function() {
        let element = this.$(),
            topDifference = Ember.$(window).scrollTop() - element.offset().top,
            percentage = 0;

        if (topDifference > 0) {
            let height = element.height(),
                topDistance = height - topDifference;

            if (topDistance < height) {
                percentage = 100 - (topDistance / height * 100);
            }
        }

        this.$('.my-image').css('background-position-y', (50 - percentage) + '%');
    },
    didInsertElement: function() {
        Ember.$(window).scroll(this.scrollBackGround.bind(this));
    },
    willDestroyElement: function() {
        Ember.$(window).off('scroll', this.scrollBackGround);
    }
});
