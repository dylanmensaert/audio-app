/* global moment */
import Ember from "ember";

export default Ember.Helper.helper(function (parameters) {
    var seconds = parameters[0],
        time = '';

    if (seconds) {
        time = moment.utc(seconds * 1000).format('mm:ss');
    }

    return time;
});
