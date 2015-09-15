import Ember from 'ember';

var debouncer;

export default Ember.Component.extend({
    init: function () {
        this._super();

        this.set('showMessage', this.show.bind(this));
    },
    classNames: ['message-bar'],
    showMessage: null,
    message: null,
    fading: false,
    visible: false,
    fadeOut: function () {
        this.set('fading', true);

        this.$().fadeOut(500, function () {
            this.set('fading', false);
            this.set('visible', false);

            this.set('message', null);
        }.bind(this));
    },
    show: function (message) {
        if (this.get('fading')) {
            this.$().stop(true, true).fadeOut();
        }

        this.set('message', message);

        if (!this.get('visible')) {
            this.$().show();
            this.set('visible', true);
        }

        debouncer = Ember.run.debounce(this, this.fadeOut, 2000);
    },
    click: function () {
        Ember.run.cancel(debouncer);

        if (!this.get('fading')) {
            this.fadeOut();
        }
    },
    didInsertElement: function () {
        this.$().hide();
    }
});
