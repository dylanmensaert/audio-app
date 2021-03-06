import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    model: null,
    src: null,
    scrollBackGround: function() {
        let element = this.$(),
            topDifference = Ember.$(window).scrollTop() - element.offset().top,
            height = element.height(),
            image = this.$('.my-image');

        if (0 <= topDifference && topDifference <= height) {
            let percentage = topDifference / height * 100;

            image.css('background-position-y', (50 - percentage) + '%');
        } else if (parseInt(image.css('background-position-y')) !== 50) {
            image.css('background-position-y', 50 + '%');
        }
    },
    updateImage: Ember.observer('model', function() {
        this.set('src', this.get('model.thumbnail'));
    }),
    didInsertElement: function() {
        // TODO: mobile rendering to slow for this to work.
        /*this.scroll(this.scrollBackGround);*/

        this.updateImage();
    }
});
