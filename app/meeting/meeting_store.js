'use strict';

angular.module('myApp')

.store('MeetingStore', function(QUEUES) {
  return {
    initialize: function() {
      console.log('Initializing meeting store');
      this.state = this.immutable({
        currentItemName: 'Motion 4: The VP Education needs to be less good looking'
      });

      this.state.set(QUEUES.CLARIFICATION, ['Jeff', 'Akshay', 'Adelle']);
      this.state.set(QUEUES.DIRECT_POINT, ['Will']);
      this.state.set(QUEUES.NEW_POINT, ['Heather', 'Mary']);
    },

    handlers: {
      'addToQueue': 'addToQueue'
    },

    addToQueue: function(payload) {
      console.log('adding to queue');
    },

    exports: {
      getQueue: function(queueName) {
        return this.state.get(queueName);
      },

      get currentItemName() {
        return this.state.get('currentItemName');
      }
    }
  };
});
