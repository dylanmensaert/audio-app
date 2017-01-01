import FixedComponent from 'audio-app/components/c-fixed';

export default FixedComponent.extend({
    classNames: ['row'],
    utils: Ember.inject.service(),
    top: Ember.computed.alias('utils.menuHeight'),
    // TODO: needs position: relative to make border-bottom show up.
    didInsertElement: function() {
        this.$('.tabs').tabs();

        this._super();
    }
});
