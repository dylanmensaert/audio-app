/* global Materialize */
import Ember from 'ember';

export default Ember.Service.extend({
    fileSystem: null,
    selectedTrackIds: [],
    showMessage: function(message) {
        Materialize.toast(message, 3000);
    },
    audioSlider: null,
    isBusy: false,
    transitionToRoute: null,
    menuHeight: 56,
    audioHeight: 51
});
