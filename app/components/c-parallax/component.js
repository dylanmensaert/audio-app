import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

function scrollBackGround() {
    let element = this.$(),
        topDifference = Ember.$(window).scrollTop() + this.get('utils.menuHeight') - element.offset().top,
        height = element.height();

    if (0 <= topDifference && topDifference <= height) {
        let percentage = topDifference / height * 100;

        this.$('.my-image').css('background-position-y', (50 - percentage) + '%');
    }
}

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-parallax'],
    src: null,
    utils: Ember.inject.service(),
    didInsertElement: function() {
        this.scroll(scrollBackGround.bind(this));
    }
});
