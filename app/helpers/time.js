/* global moment */
import Ember from 'ember';

export default Ember.Helper.helper(function(parameters) {
    let seconds = parameters[0];

    if (!seconds) {
        seconds = 0;
    }

    return moment.utc(seconds * 1000).format('mm:ss');
});
