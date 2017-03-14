/*global window, parseInt*/

import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-fixed-row'],
    classNameBindings: ['transitionClassName'],
    placeholder: null,
    alignmentAtStart: 'top',
    alignmentWithValue: null,
    offset: 0,
    getAlignment: function() {
        let alignment = this.get('alignment');

        if (!alignment) {
            alignment = 'top';
        }

        return alignment;
    },
    transitionClassName: Ember.computed('alignment', function() {
        return 'my-transition-' + this.getAlignment();
    }),
    updatePosition: function(dohide) {
        let placeholder = this.get('placeholder'),
            offset,
            position;

        placeholder.show();

        if (dohide) {
            offset = placeholder.outerHeight();
        } else {
            offset = 0 - this.get('alignmentWithValue').value;
        }

        if (placeholder.offset().top + offset < Ember.$(window).scrollTop()) {
            position = 'fixed';
        } else {
            placeholder.hide();

            position = 'static';
        }

        this.$().css('position', position);
    },
    transitionTo: function(doHide) {
        let alignment = this.get('alignmentWithValue'),
            element = this.$(),
            value = alignment.value;

        if (!doHide) {
            value = this.get('offset') - element.outerHeight();
        }

        element.css(alignment.name, value);
    },
    updateTransition: function(doHide) {
        let alignment = this.get('alignmentWithValue'),
            element = this.$(),
            isHidden = parseInt(element.css(alignment.name)) < 0;

        if (doHide) {
            if (!isHidden) {
                this.transitionTo();
            }
        } else if (isHidden) {
            this.transitionTo(true);
        }
    },
    didInsertElement: function() {
        let alignment = this.getAlignment(),
            element = this.$(),
            placeholder,
            onscroll;

        this.set('alignmentWithValue', {
            name: alignment,
            value: parseInt(element.css(alignment))
        });

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        placeholder.css('background-color', element.css('background-color'));

        element.before(placeholder);
        this.set('placeholder', placeholder);

        if (this.get('alignmentAtStart')) {
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
    },
    willDestroyElement: function() {
        let placeholder = this.get('placeholder');

        this._super();

        if (placeholder) {
            placeholder.remove();
        }
    }
});
