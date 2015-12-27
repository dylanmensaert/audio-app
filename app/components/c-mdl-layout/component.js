import Ember from 'ember';
import ComponentMdl from 'audio-app/components/c-mdl';
import logic from 'audio-app/utils/logic';

export default ComponentMdl.extend({
    cache: Ember.inject.service(),
    classNames: ['mdl-layout', 'mdl-js-layout', 'mdl-layout--fixed-drawer', 'mdl-layout--fixed-header'],
    didInsertElement: function() {
        Ember.$(window).resize(function() {
            this.$('.my-outer-image').each(function() {
                logic.setOuterHeight(Ember.$(this));
            });

            this.$('.my-inner-image').each(function() {
                var currentElement = Ember.$(this);

                logic.setInnerHeight(currentElement);

                logic.setTop(currentElement, currentElement.parent().height());
            });
        }.bind(this));

        this._super();
    },
    willDestroyElement: function() {
        Ember.$(window).off('resize');
    },
    currentTargetName: Ember.computed('cache.completedTransitions.lastObject', function() {
        var currentTransition = this.get('cache.completedTransitions.lastObject'),
            currentTargetName,
            resolvedModel;

        if(currentTransition) {
            currentTargetName = currentTransition.targetName;
            resolvedModel = currentTransition.resolvedModels[currentTargetName];

            if(resolvedModel) {
                currentTargetName += '/' + resolvedModel.id;
            }
        }

        return currentTargetName;
    }),
    actions: {
        transitionToRoute: function(name, model) {
            var currentTargetName = this.get('currentTargetName'),
                targetName = name;

            if(model) {
                targetName += '/' + model;
            }

            if(name === this.get('cache.completedTransitions.lastObject').targetName) {
                this.$('.mdl-layout__drawer').removeClass('is-visible');
            }

            if(currentTargetName !== targetName) {
                this.get('cache.completedTransitions').clear();

                if(model) {
                    this.sendAction('transitionToRoute', name, model);
                } else {
                    this.sendAction('transitionToRoute', name);
                }
            }
        }
    }
});
