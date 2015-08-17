import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'suggest_input_group',
  liveQuery: null,
  editLabel: null,
  fetchSuggestions: null,
  isEditMode: false,
  label: function() {
    var label = 'Search';

    if(this.get('isEditMode')) {
      label = this.get('editLabel');
    }

    return label + '...';
  }.property('editLabel', 'isEditMode'),
  actions: {
      // TODO: Clearing input does not work. Seems like bug regarding material design.
      clear: function() {
          this.$('input').focus();

          this.set('liveQuery', '');
      },
      saveEdit: function() {
          this.sendAction('saveEdit');
      },
      search: function() {
          this.sendAction('search');
      }
  }
});
