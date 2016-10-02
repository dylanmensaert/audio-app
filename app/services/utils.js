/* global Materialize */
import Ember from 'ember';

export default Ember.Service.extend({
    fileSystem: null,
    selectedTrackIds: [],
    playedTrackIds: [],
    // TODO: place somewhere else.
    showMessage: function(message) {
        Materialize.toast(message, 3000);
    },
    audioSlider: null,
    isBusy: false,
    transitionToRoute: null,
    history: [],
    back: function() {
        let history = this.get('history'),
            removeLast,
            previousTransition;

        removeLast = function() {
            history.removeAt(history.get('length') - 1);
        };

        if (history.get('length') >= 2) {
            removeLast();
            previousTransition = history.get('lastObject');
            removeLast();

            this.transitionToRoute.apply(this, previousTransition);
        } else {
            this.transitionToRoute('search');
        }
    }
});