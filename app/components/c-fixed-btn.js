import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

function updatePosition() {
    let element = this.$(),
        className = 'my-fixed',
        btn = element.find('> a'),
        wasFixed = element.hasClass(className),
        redraw;

    redraw = function() {
        btn.remove();
        element.prepend(btn);
    }

    element.removeClass(className);

    if (Ember.$(window).scrollTop() + this.get('utils.menuHeight') > btn.offset().top) {
        element.addClass(className);

        if (!wasFixed) {
            redraw();
        }
    } else if (wasFixed) {
        redraw();
    }
}

export default Ember.Component.extend(safeStyleMixin, scrollMixin, {
    style: Ember.computed('audioPlayer.track', 'utils.audioHeight', function() {
        let bottom = 45;

        if (this.get('audioPlayer.track')) {
            bottom += this.get('utils.audioHeight');
        }

        return 'bottom: ' + bottom + 'px;';
    }),
    audioPlayer: Ember.inject.service(),
    utils: Ember.inject.service(),
    didInsertElement: function() {
        this.scroll(updatePosition.bind(this));
    }
});
