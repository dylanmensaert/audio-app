/* global Materialize */
import Ember from 'ember';

var lastScrollTop = 0;

export default Ember.Service.extend({
    init: function() {
        let display = Ember.$(window),
            scrolls = this.get('scrolls');

        display.scroll(function() {
            let scrollTop = display.scrollTop(),
                didScrollToTop = scrollTop === 0,
                didScrollToBottom = Math.ceil(scrollTop + display.height()) === Ember.$(document).height();

            if (didScrollToTop || didScrollToBottom || Math.abs(lastScrollTop - scrollTop) > 5) {
                let didScrollDown = lastScrollTop < scrollTop,
                    doHide = didScrollDown && !didScrollToBottom;

                scrolls.forEach(function(scroll) {
                    scroll(doHide);
                });
            }

            lastScrollTop = scrollTop;
        }.bind(this));
    },
    fileSystem: null,
    showMessage: function(message) {
        Materialize.toast(message, 3000);
    },
    audioSlider: null,
    isBusy: false,
    transitionToRoute: null,
    menuHeight: 56,
    audioHeight: 51,
    scrolls: []
});
