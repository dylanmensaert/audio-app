import Ember from 'ember';
import layout from 'audio-app/templates/btn';

export default Ember.Mixin.create({
    layout: layout,
    classNames: ['slds-button', 'my-relative'],
    classNameBindings: ['buttonClass', 'pendingClass'],
    buttonClass: Ember.computed('styling', function() {
        return 'slds-button--' + this.get('styling');
    }),
    styling: 'brand',
    spinnerClassSuffix: Ember.computed('styling', function() {
        let styling = this.get('styling'),
            spinnerClassSuffix;

        if (styling === 'brand') {
            spinnerClassSuffix = 'inverse';
        } else {
            spinnerClassSuffix = 'brand';
        }

        return spinnerClassSuffix;
    }),
    pendingClass: Ember.computed('isPending', function() {
        let isPending = this.get('isPending'),
            pendingClass;

        if (isPending) {
            pendingClass = 'my-pending';
        }

        return pendingClass;
    }),
    value: null
});
