import Ember from 'ember';

export default Ember.Helper.helper(function(parameters) {
    return parameters[0] === parameters[1];
});
