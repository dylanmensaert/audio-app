import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    cache: Ember.inject.service(),
    classNames: ['mdl-layout', 'mdl-js-layout', 'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header'],
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            // TODO: duplicate with audio-track/component
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
    currentTargetName: function() {
        var currentTransition = this.get('cache.completedTransitions.lastObject'),
            currentTargetName,
            resolvedModel;

        currentTargetName = currentTransition.targetName;
        resolvedModel = currentTransition.resolvedModels[currentTargetName];

        if (resolvedModel) {
            currentTargetName += '/' + resolvedModel.id;
        }

        return currentTargetName;
    }.property('cache.completedTransitions.lastObject'),
    actions: {
        transitionToRoute: function(name, model) {
            this.get('cache.completedTransitions').clear();

            if (model) {
                this.sendAction('transitionToRoute', name, model);
            } else {
                this.sendAction('transitionToRoute', name);
            }
        }
    }
});
