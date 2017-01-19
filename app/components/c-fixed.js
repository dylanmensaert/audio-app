/*global window, parseInt*/

import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

var lastScrollTop = 0;

function updatePosition() {
    let placeholder = this.get('placeholder'),
        element = this.$(),
        scrollTop = Ember.$(window).scrollTop(),
        offset,
        position;

    placeholder.show();

    if (lastScrollTop < scrollTop) {
        offset = placeholder.outerHeight();
    } else {
        offset = 0 - element.data('top');
    }

    if (placeholder.offset().top + offset < scrollTop) {
        position = 'fixed';
    } else {
        placeholder.hide();

        position = 'static';
    }

    element.css('position', position);

    lastScrollTop = scrollTop;
}

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-fixed-row'],
    classNameBindings: ['hideOnScroll:js-hide-on-scroll'],
    hideOnScroll: true,
    placeholder: null,
    getInt: function(attribute) {
        return parseInt(this.$().css(attribute));
    },
    didInsertElement: function() {
        let element = this.$(),
            placeholder;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);
        this.set('placeholder', placeholder);

        if (this.get('hideOnScroll')) {
            element.data('top', this.getInt('top'));

            if (placeholder.offset().top !== 0 && this.getInt('bottom') !== 0) {
                this.scroll(updatePosition.bind(this));

                element.css('position', 'static');

                placeholder.hide();
            }
        }
    },
    willDestroyElement: function() {
        this._super();

        this.get('placeholder').remove();
    }
});
