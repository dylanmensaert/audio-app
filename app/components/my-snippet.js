import Ember from 'ember';

export default Ember.Component.extend({
    layoutName: 'snippet',
    classNames: ['mdl-card', 'mdl-cell', 'mdl-shadow--2dp', 'my-card'],
    classNameBindings: ['model.isSelected:active'],
    attributeBindings: ['name'],
    model: null,
    name: function () {
        return this.get('model.id');
    }.property('model.id'),
    showQueued: false,
    didInsertElement: function () {
        this.$().on('swipeleft', function () {
            this.sendAction('swipeleft', this.get('model'));
        }.bind(this));

        this.$().on('swiperight', function () {
            this.sendAction('swiperight', this.get('model'));
        }.bind(this));
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
