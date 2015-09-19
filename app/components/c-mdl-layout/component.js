import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    cache: Ember.inject.service(),
    classNames: ['mdl-layout', 'mdl-js-layout', 'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header'],
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            // TODO: duplicate with audio-recording/component
            this.$('.outer-image').each(function() {
                Ember.$(this).height(Ember.$(this).width() / 30 * 17);
            });

            this.$('.inner-image').each(function() {
                Ember.$(this).height(Ember.$(this).width() / 12 * 9);

                Ember.$(this).css('top', -Math.floor((Ember.$(this).height() - Ember.$(this).parent().height()) / 2));
            });
        }.bind(this));

        this._super();
    },
    willDestroyElement: function() {
        Ember.$(window).off('resize');
    },
    actions: {
        transitionToRoute: function(name) {
            this.get('cache.completedTransitions').clear();

            this.sendAction('transitionToRoute', name);
        }
    }
});
