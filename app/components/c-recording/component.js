import Ember from 'ember';

// TODO: duplication with audio-album/component
export default Ember.Component.extend({
    classNameBindings: ['model.isSelected:my-active'],
    model: null,
    showQueued: false,
    didInsertElement: function() {
        var outerImage = this.$('.outer-image'),
            innerImage = this.$('.inner-image');

        this.$().on('swipeleft', function() {
            this.sendAction('swipeleft', this.get('model'));
        }.bind(this));

        this.$().on('swiperight', function() {
            this.sendAction('swiperight', this.get('model'));
        }.bind(this));

        // TODO: duplicate with mdl-layout/component
        outerImage.height(outerImage.width() / 30 * 17);
        innerImage.height(innerImage.width() / 12 * 9);
        innerImage.css('top', -Math.floor((innerImage.height() - outerImage.height()) / 2));
    },
    willDestroyElement: function() {
        this.$().off('swipeleft');
        this.$().off('swiperight');
    },
    actions: {
        toggleIsSelected: function() {
            var model = this.get('model');

            model.toggleProperty('isSelected');

            this.sendAction('toggleIsSelected', model);
        },
        click: function() {
            this.sendAction('action', this.get('model'));
        }
    }
});
