import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';

export default ComponentMdl.extend({
    cache: Ember.inject.service(),
    classNames: ['mdl-layout', 'mdl-js-layout', 'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header'],
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            // TODO: duplicate with audio-track/component
            this.$('.my-outer-image').each(function() {
                Ember.$(this).height(Ember.$(this).width() / 30 * 17);
            });

            this.$('.my-inner-image').each(function() {
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

        if (currentTransition) {
            currentTargetName = currentTransition.targetName;
            resolvedModel = currentTransition.resolvedModels[currentTargetName];

            if (resolvedModel) {
                currentTargetName += '/' + resolvedModel.id;
            }
        }

        return currentTargetName;
    }.property('cache.completedTransitions.lastObject'),
    actions: {
        transitionToRoute: function(name, model) {
            var currentTargetName = this.get('currentTargetName'),
                targetName = name;

            if (model) {
                targetName += '/' + model;
            }

            if (name === this.get('cache.completedTransitions.lastObject').targetName) {
                this.$('.mdl-layout__drawer').removeClass('is-visible');
            }

            if (currentTargetName !== targetName) {
                this.get('cache.completedTransitions').clear();

                if (model) {
                    this.sendAction('transitionToRoute', name, model);
                } else {
                    this.sendAction('transitionToRoute', name);
                }
            }
        }
    }
});
