/*global window, parseInt, Waves*/

import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-fixed-row'],
    classNameBindings: ['transitionClassName'],
    placeholder: null,
    isFixed: true,
    offset: 0,
    alignment: 'top',
    value: null,
    transitionClassName: Ember.computed('alignment', function() {
        return 'my-transition-' + this.get('alignment');
    }),
    updatePosition: function(dohide) {
        let placeholder = this.get('placeholder'),
            offset,
            position;

        placeholder.show();

        if (dohide) {
            offset = placeholder.outerHeight(true);
        } else {
            offset = 0 - this.get('value');
        }

        if (placeholder.offset().top + offset < Ember.$(window).scrollTop()) {
            position = 'fixed';
        } else {
            placeholder.hide();

            position = 'static';
        }

        this.$().css('position', position);
    },
    updateTransition: function(doHide) {
        let element = this.$(),
            value = this.get('value');

        if (doHide) {
            value = this.get('offset') - element.outerHeight(true);
        }

        element.css(this.get('alignment'), value);
    },
    didInsertElement: function() {
        let element = this.$(),
            placeholder,
            onscroll;

        this.set('value', parseInt(element.css(this.get('alignment'))));

        placeholder = Ember.$('<div>', {
            height: element.outerHeight(true)
        });

        placeholder.css('background-color', element.css('background-color'));

        element.before(placeholder);
        this.set('placeholder', placeholder);

        if (this.get('isFixed')) {
            onscroll = this.updateTransition;
        } else {
            onscroll = function(doHide) {
                this.updatePosition(doHide);
                this.updateTransition(doHide);
            };

            element.css('position', 'static');
            placeholder.hide();
        }

        this.scroll(onscroll);

        // TODO: place Waves somewhere more logical
        Waves.init();
    },
    willDestroyElement: function() {
        let placeholder = this.get('placeholder');

        this._super();

        if (placeholder) {
            placeholder.remove();
        }
    }
});
