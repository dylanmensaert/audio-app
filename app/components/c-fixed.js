import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';

export default Ember.Component.extend(safeStyleMixin, {
    classNames: ['my-fixed'],
    placeholder: null,
    top: 0,
    offsetTop: null,
    updatePosition: function() {
        let placeholder = this.get('placeholder'),
            position;

        if (this.get('offsetTop') - this.get('top') < Ember.$(window).scrollTop()) {
            position = 'fixed';
            placeholder.show();
        } else {
            position = 'static';
            placeholder.hide();
        }

        this.$().css({
            position
        });
    },
    didInsertElement: function() {
        let element = this.$(),
            offsetTop,
            placeholder;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);

        offsetTop = placeholder.offset().top;

        this.set('offsetTop', offsetTop);
        this.set('placeholder', placeholder);

        if (offsetTop !== 0) {
            Ember.$(window).scroll(this.updatePosition.bind(this));

            element.css({
                top: this.get('top'),
                position: 'static'
            });

            placeholder.hide();
        }
    },
    willDestroyElement: function() {
        if (this.get('offsetTop') !== 0) {
            Ember.$(window).off('scroll', this.updatePosition);
        }

        this.get('placeholder').remove();
    }
});
