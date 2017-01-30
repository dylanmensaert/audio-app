/*global window, parseInt*/

import Ember from 'ember';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(scrollMixin, {
    classNames: ['my-fixed-row'],
    classNameBindings: ['transitionClassName'],
    placeholder: true,
    alignment: 'top',
    _alignment: null,
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
            offset = 0 - this.get('_alignment').value;
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
        let alignment = this.get('_alignment');

        this.$().css(alignment.name, value);
        alignment.isHidden = doHide;

        this.set('_alignment', alignment);
    },
    updateTransition: function(didScrollDown) {
        let alignment = this.get('_alignment');

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
            placeholder = this.get('placeholder');

        this.set('_alignment', {
            name: alignment,
            value: parseInt(element.css(alignment))
        });

        if (placeholder) {
            let offset,
                onscroll;

            placeholder = Ember.$('<div>', {
                height: element.outerHeight()
            });

            offset = placeholder.offset();

            element.before(placeholder);
            this.set('placeholder', placeholder);

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
        }
    },
    willDestroyElement: function() {
        this._super();

        this.get('placeholder').remove();
    }
});
