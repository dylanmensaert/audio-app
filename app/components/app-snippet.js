import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'snippet',
  classNames: ['list-group-item', 'snippet-item'],
  classNameBindings: ['model.isSelected:btn-material-grey-400'],
  attributeBindings: ['name'],
  model: null,
  name: function() {
      return this.get('model.id');
  }.property('model.id'),
  showQueued: false,
  didInsertElement: function() {
      this.$().on('swipeleft', function() {
          this.sendAction('swipeleft', this.get('model'));
      }.bind(this));

      this.$().on('swiperight', function() {
          this.sendAction('swiperight', this.get('model'));
      }.bind(this));
  },
  willDestroyElement: function() {
      this.$().off('swipeleft');
      this.$().off('swiperight');
  },
  actions: {
      toggleSelection: function() {
          this.get('model').toggleProperty('isSelected');
      },
      click: function() {
          this.sendAction('action', this.get('model'));
      }
  }
});
