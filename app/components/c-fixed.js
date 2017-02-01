/*global window, parseInt*/

import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-fixed-row'],
    classNameBindings: ['transitionClassName'],
    placeholder: null,
    alignment: 'top',
    initialAlignment: null,
    transitionClassName: Ember.computed('alignment', function() {
        return 'my-transition-' + this.get('alignment');
    }),
    updatePosition: function(didScrollDown) {
        let placeholder = this.get('placeholder'),
            offset,
            position;

        placeholder.show();

        if (didScrollDown) {
            offset = placeholder.outerHeight();
        } else {
            offset = 0 - this.get('initialAlignment').value;
        }

        if (placeholder.offset().top + offset < Ember.$(window).scrollTop()) {
            position = 'fixed';
        } else {
            placeholder.hide();

            position = 'static';
        }

        this.$().css('position', position);
    },
    transitionTo: function(doHide, value) {
        let alignment = this.get('initialAlignment');

        this.$().css(alignment.name, value);
        alignment.isHidden = doHide;

        this.set('initialAlignment', alignment);
    },
    updateTransition: function(didScrollDown) {
        let alignment = this.get('initialAlignment');

        if (didScrollDown) {
            if (!alignment.isHidden) {
                this.transitionTo(true, 0 - this.$().outerHeight());
            }
        } else if (alignment.isHidden) {
            this.transitionTo(false, alignment.value);
        }
    },
    didInsertElement: function() {
        let alignment = this.get('alignment'),
            element = this.$(),
            placeholder,
            offset,
            onscroll;

        this.set('initialAlignment', {
            name: alignment,
            value: parseInt(element.css(alignment))
        });

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);
        this.set('placeholder', placeholder);

        offset = placeholder.offset();

        if (offset.top !== 0 && offset.bottom !== 0) {
            onscroll = function(didScrollDown) {
                this.updatePosition(didScrollDown);
                this.updateTransition(didScrollDown);
            };

            element.css('position', 'static');
            placeholder.hide();
        } else {
            onscroll = this.updateTransition;
        }

        this.scroll(onscroll);
    },
    willDestroyElement: function() {
        this._super();

        this.get('placeholder').remove();
    }
});
