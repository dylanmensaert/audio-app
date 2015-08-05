import Ember from 'ember';
import updateTitle from 'my-app/utils/update-title';

export default Ember.Route.extend(updateTitle, {
  title: 'Index',
  actions: {
      didTransition: function() {
          if (this.get('cache').isMobileConnection()) {
              this.controller.set('searchOnline', false);
          }

          if (this.controller.get('searchOnline')) {
              this.controller.scheduleUpdateOnlineSnippets();
          }

          return true;
      }
  }
});
