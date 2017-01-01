import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

function updatePosition() {
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
}

export default Ember.Component.extend(safeStyleMixin, scrollMixin, {
    classNames: ['my-fixed'],
    placeholder: null,
    top: 0,
    offsetTop: null,
    onscroll: null,
    didInsertElement: function() {
        let element = this.$(),
            offsetTop,
            placeholder;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);
        this.set('placeholder', placeholder);

        offsetTop = placeholder.offset().top;

        if (offsetTop !== 0 && element.css('bottom') !== '0px') {
            this.set('offsetTop', offsetTop);

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
