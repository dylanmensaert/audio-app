import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

function scrollBackGround() {
    let element = this.$(),
        topDifference = Ember.$(window).scrollTop() + this.get('utils.menuHeight') - element.offset().top,
        height = element.height(),
        image = this.$('.my-image');

    if (0 <= topDifference && topDifference <= height) {
        let percentage = topDifference / height * 100;

        image.css('background-position-y', (50 - percentage) + '%');
    } else if (parseInt(image.css('background-position-y') !== 50)) {
        image.css('background-position-y', 50 + '%');
    }
}

export default Ember.Component.extend(scrollMixin, {
    src: null,
    utils: Ember.inject.service(),
    didInsertElement: function() {
        this.scroll(scrollBackGround.bind(this));
    }
});
