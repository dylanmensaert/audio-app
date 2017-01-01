import FixedComponent from 'audio-app/components/c-fixed';

export default FixedComponent.extend({
    top: 56,
    // TODO: needs position: relative to make border-bottom show up.
    didInsertElement: function() {
        this.$('.tabs').tabs();

        this._super();
    }
});
