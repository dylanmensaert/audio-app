import Ember from 'ember';

export default Ember.Helper.helper(function (parameters) {
    return parameters.toArray().every(function (condition) {
        return condition;
    });
});
