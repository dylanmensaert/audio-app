import Ember from 'ember';
import safeStyleMixin from 'audio-app/mixins/safe-style';
import scrollMixin from 'audio-app/mixins/c-scroll';

function updatePosition() {
    let element = this.$(),
        className = 'my-fixed-btn';

    element.removeClass(className);

    if (Ember.$(window).scrollTop() + this.get('utils.menuHeight') > element.find('> a').offset().top) {
        element.addClass(className);
    }
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
