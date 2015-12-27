import Ember from 'ember';

var debouncer;

export default Ember.Component.extend({
    cache: Ember.inject.service(),
    audioPlayer: Ember.inject.service(),
    init: function() {
        this._super();

        this.set('cache.showMessage', this.show.bind(this));
    },
    classNames: ['my-message-bar'],
    classNameBindings: ['isAudioPlayerDefaultMode:my-default-message-bar', 'isAudioPlayerLargeMode:my-fixed-message-bar'],
    isAudioPlayerDefaultMode: Ember.computed('audioPlayer.track', 'audioPlayer.isLargeMode', function() {
        return this.get('audioPlayer.track') && !this.get('audioPlayer.isLargeMode');
    }),
    isAudioPlayerLargeMode: Ember.computed('audioPlayer.track', 'audioPlayer.isLargeMode', function() {
        return this.get('audioPlayer.track') && this.get('audioPlayer.isLargeMode');
    }),
    message: null,
    fading: false,
    visible: false,
    fadeOut: function() {
        this.set('fading', true);

        this.$().fadeOut(500, function() {
            this.set('fading', false);
            this.set('visible', false);

            this.set('message', null);
        }.bind(this));
    },
    show: function(message) {
        if(this.get('fading')) {
            this.$().stop(true, true).fadeOut();
        }

        this.set('message', message);

        if(!this.get('visible')) {
            this.$().show();
            this.set('visible', true);
        }

        debouncer = Ember.run.debounce(this, this.fadeOut, 2000);
    },
    click: function() {
        Ember.run.cancel(debouncer);

        if(!this.get('fading')) {
            this.fadeOut();
        }
    },
    didInsertElement: function() {
        this.$().hide();
    }
});
