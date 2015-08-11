import Ember from 'ember';

export default Ember.Controller.extend({
    linkToProperties: {
        classNameBindings: ['active:btn-material-amber-A700:btn-default']
    },
    actions: {
        transitionToQueue: function () {
            this.get('fileSystem.snippets').setEach('isSelected', false);

            this.transitionToRoute('queue.index');
        },
        selectAll: function () {
            // TODO: select all
        }
    }
});
