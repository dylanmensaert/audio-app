import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        transitionToQueue: function () {
            this.get('fileSystem.snippets').setEach('isSelected', false);

            this.transitionToRoute('queue.index');
        }
    }
});
