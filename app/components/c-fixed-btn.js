import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

export default Ember.Component.extend(safeStyleMixin, scrollMixin, {
    classNames: ['my-fixed-btn'],
    style: Ember.computed('audioPlayer.track', 'utils.audioHeight', function() {
        let bottom = 70;

        if (this.get('audioPlayer.track')) {
            bottom += this.get('utils.audioHeight');
        }

        return 'bottom: ' + bottom + 'px;';
    }),
    audioPlayer: Ember.inject.service(),
    utils: Ember.inject.service(),
    redraw: function(btn) {
        let element = this.$();

        btn.remove();
        element.prepend(btn);
    },
    updateStaticPosition: function(didScrollDown) {
        let scrollTop = Ember.$(window).scrollTop(),
            element = this.$(),
            className = 'my-fixed',
            btn = element.find('> a'),
            wasFixed = element.hasClass(className);

        element.removeClass(className);

        if (scrollTop + this.get('utils.menuHeight') > btn.offset().top) {
            if (didScrollDown) {
                if (wasFixed) {
                    this.redraw(btn);
                }
            } else {
                element.addClass(className);

                if (!wasFixed) {
                    this.redraw(btn);
                }
            }
        } else if (wasFixed) {
            this.redraw(btn);
        }
    },
    updateFixedPosition: function(didScrollDown) {
        let element = this.$(),
            btn = element.find('> a'),
            isHidden = element.css('display') === 'none';

        if (didScrollDown) {
            if (!isHidden) {
                element.hide();
            }
        } else if (isHidden) {
            element.show();
        }
    },
    didInsertElement: function(didScrollDown) {
        let onscroll;

        if (this.$().css('position') === 'fixed') {
            onscroll = this.updateFixedPosition;
        } else {
            onscroll = this.updateStaticPosition;
        }

        this.scroll(onscroll);
    }
});
