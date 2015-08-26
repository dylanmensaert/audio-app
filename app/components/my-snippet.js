import Ember from 'ember';

export default Ember.Component.extend({
    layoutName: 'snippet',
    classNames: ['mdl-card', 'mdl-cell', 'mdl-shadow--2dp', 'my-card', 'mdl-cell--2-col-phone', 'mdl-cell--4-col-tablet'],
    classNameBindings: ['model.isSelected:active'],
    attributeBindings: ['name'],
    model: null,
    name: function () {
        return this.get('model.id');
    }.property('model.id'),
    showQueued: false,
    didInsertElement: function () {
        var outerImage = this.$('.outer-image'),
            innerImage = this.$('.inner-image');

        this.$().on('swipeleft', function () {
            this.sendAction('swipeleft', this.get('model'));
        }.bind(this));

        this.$().on('swiperight', function () {
            this.sendAction('swiperight', this.get('model'));
        }.bind(this));

        // TODO: duplicate with mdl-layout/component
        outerImage.height(outerImage.width() / 30 * 17);
        innerImage.height(innerImage.width() / 12 * 9);
        innerImage.css('top', -Math.floor((innerImage.height() - outerImage.height()) / 2));
    },
    willDestroyElement: function () {
        this.$().off('swipeleft');
        this.$().off('swiperight');
    },
    hasStatus: function () {
        return this.get('model.isPlaying') || this.get('showQueued') || this.get('model.isDownloading') || this.get('model.isDownloaded');
    }.property('model.isPlaying', 'showQueued', 'model.isDownloading', 'model.isDownloaded'),
    actions: {
        toggleSelection: function () {
            this.get('model').toggleProperty('isSelected');
        },
        click: function () {
            this.sendAction('action', this.get('model'));
        }
    }
});
