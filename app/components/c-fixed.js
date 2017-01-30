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
        offset = 0 - element.data('hide-on-scroll').value;
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
    classNames: ['my-fixed-row', 'js-hide-on-scroll'],
    placeholder: null,
    alignment: 'top',
    isStatic: false,
    didInsertElement: function() {
        let alignment = this.get('alignment'),
            element = this.$(),
            placeholder,
            attribute;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        attribute = {
            name: alignment,
            value: parseInt(this.$().css(alignment))
        };

        element.before(placeholder);
        this.set('placeholder', placeholder);

        element.data('hide-on-scroll', attribute);

        if (placeholder.offset().top !== 0) {
            if (this.get('isStatic')) {
                this.scroll(updatePosition.bind(this));
            }

            element.css('position', 'static');

            placeholder.hide();
        }
    },
    willDestroyElement: function() {
        this._super();

        this.get('placeholder').remove();
    }
});
