import Ember from 'ember';

let inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

export default Ember.Helper.helper(function(parameters) {
    let counter = parameters[0],
        singularizedLabel = parameters[1],
        label;

    if (counter === 1) {
        label = singularizedLabel;
    } else {
        label = inflector.pluralize(singularizedLabel);
    }

    if (Ember.isNone(counter)) {
        counter = 0;
    }

    return counter + ' ' + label;
});
