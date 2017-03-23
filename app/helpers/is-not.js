import Ember from 'ember';

export default Ember.Helper.helper(function(parameters) {
    let value = !parameters[0];

    if (!value) {
        value = undefined;
    }

    return value;
});
