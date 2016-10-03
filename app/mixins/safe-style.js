import Ember from 'ember';

export default Ember.Mixin.create({
    attributeBindings: ['safeStyle:style'],
    style: null,
    safeStyle: Ember.computed('style', function() {
        let style = this.get('style');

        if (style) {
            style = Ember.String.htmlSafe(style);
        }

        return style;
    })
});
