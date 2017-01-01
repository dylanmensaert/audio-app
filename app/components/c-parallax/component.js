import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

function scrollBackGround() {
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
}

export default Ember.Component.extend(scrollMixin, {
    src: null,
    didInsertElement: function() {
        this.scroll(scrollBackGround.bind(this));
    }
});
