import FixedComponent from 'audio-app/components/c-fixed';

export default FixedComponent.extend({
    classNames: ['my-tabs-container'],
    isFixed: false,
    // TODO: needs position: relative to make border-bottom show up.
    didInsertElement: function() {
        // TODO: not working in mobile because of hash
        this.$('.tabs').tabs();

        this._super();
    }
});
