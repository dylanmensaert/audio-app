import Ember from 'ember';

export default Ember.Controller.extend({
    audioPlayer: Ember.inject.service(),
    isLoading: false,
    linkToProperties: {
        classNameBindings: ['active:mdl-color--blue-grey-800']
    },
    actions: {
        dismissAlert: function () {
            this.set('error', null);
        }
    }
});
