/* global Materialize */
import Ember from 'ember';

export default Ember.Service.extend({
    fileSystem: null,
    selectedTrackIds: [],
    // TODO: place somewhere else.
    showMessage: function(message) {
        Materialize.toast(message, 3000);
    },
    audioSlider: null,
    isBusy: false,
    transitionToRoute: null
});
