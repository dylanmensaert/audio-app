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
    updatePosition: function(didScrollDown) {
        let placeholder = this.get('placeholder'),
            offset,
            position;

        placeholder.show();

        if (didScrollDown) {
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
    transitionTo: function(doShow) {
        let alignment = this.get('alignmentWithValue'),
            element = this.$(),
            value = alignment.value;

        if (doShow) {
            value = this.get('offset') - element.outerHeight();
        }

        element.css(alignment.name, value);
    },
    updateTransition: function(didScrollDown) {
        let alignment = this.get('alignmentWithValue'),
            placeholder = this.get('placeholder'),
            element = this.$(),
            isHidden = parseInt(element.css(alignment.name)) < 0,
            display = Ember.$(window);

        if (alignment.name === 'bottom' && placeholder.offset().top <= display.scrollTop() + display.height() && isHidden) {
            this.transitionTo();
        } else if (didScrollDown) {
            if (!isHidden) {
                this.transitionTo(true);
            }
        } else if (isHidden) {
            this.transitionTo();
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

        element.before(placeholder);
        this.set('placeholder', placeholder);

        if (this.get('alignmentAtStart')) {
            onscroll = this.updateTransition;
        } else {
            onscroll = function(didScrollDown) {
                this.updatePosition(didScrollDown);
                this.updateTransition(didScrollDown);
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
