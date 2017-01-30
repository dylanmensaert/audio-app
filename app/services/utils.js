/* global Materialize */
import Ember from 'ember';

var lastScrollTop = 0;

export default Ember.Service.extend({
    init: function() {
        let display = Ember.$(window),
            scrolls = this.get('scrolls');

        display.scroll(function() {
            let scrollTop = display.scrollTop(),
                didScrollDown = lastScrollTop < scrollTop;

            scrolls.forEach(function(scroll) {
                scroll(didScrollDown);
            });

            lastScrollTop = scrollTop;
        }.bind(this));
    },
    fileSystem: null,
    selectedTrackIds: [],
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
