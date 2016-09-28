import Ember from 'ember';

export default Ember.Mixin.create({
    classNameBindings: ['disabledClass'],
    disabledClass: Ember.computed('disabled', function() {
        let disabledClass;

        if (this.get('disabled')) {
            disabledClass = 'my-disabled';
        } else {
            disabledClass = 'my-btn';
        }

        return disabledClass;
    })
});
