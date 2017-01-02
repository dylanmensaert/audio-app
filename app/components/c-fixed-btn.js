import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

function updatePosition() {
    let element = this.$(),
        className = 'my-fixed',
        btn = element.find('.btn-floating:first-child')[0];

    element.removeClass(className);

    btn.style.webkitAnimation = 'none';

    if (Ember.$(window).scrollTop() + this.get('utils.menuHeight') > element.find('> a').offset().top) {
        element.addClass(className);
    }

    setTimeout(function() {
        btn.style.webkitAnimation = '';
    }, 1);
}

// TODO: add popup css
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
