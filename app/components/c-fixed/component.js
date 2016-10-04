import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['my-fixed'],
    placeholder: null,
    didInsertElement: function() {
        let element = this.$(),
            placeholder;

        placeholder = Ember.$('<div>', {
            height: element.outerHeight()
        });

        element.before(placeholder);

        this.set('placeholder', placeholder);
    },
    willDestroyElement: function() {
        this.get('placeholder').remove();
    }
});
