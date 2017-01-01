import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

function updatePosition() {
    let placeholder = this.get('placeholder'),
        position;

    placeholder.show();

    if (placeholder.offset().top < Ember.$(window).scrollTop() + this.get('top')) {
        position = 'fixed';
    } else {
        placeholder.hide();

        position = 'static';
    }

    this.$().css({
        position
    });
}

export default Ember.Component.extend(safeStyleMixin, scrollMixin, {
    classNames: ['my-fixed'],
    placeholder: null,
    top: 0,
    didInsertElement: function() {
        let element = this.$(),
            placeholder;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);
        this.set('placeholder', placeholder);

        if (placeholder.offset().top !== 0 && element.css('bottom') !== '0px') {
            this.scroll(updatePosition.bind(this));

            element.css({
                top: this.get('top'),
                position: 'static'
            });

            placeholder.hide();
        }
    },
    willDestroyElement: function() {
        this._super();

        this.get('placeholder').remove();
    }
});
