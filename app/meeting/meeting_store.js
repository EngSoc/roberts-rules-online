'use strict';

angular.module('myApp')

.store('MeetingStore', function(QUEUES) {
  return {
    initialize: function() {
      console.log('Initializing meeting store');
      this.state = this.immutable({
        currentItemName: '',
        currentQueue: null
      });

      this.state.set(QUEUES.CLARIFICATION, []);
      this.state.set(QUEUES.DIRECT_POINT, []);
      this.state.set(QUEUES.NEW_POINT, []);
    },

    handlers: {
      'addToQueue': 'addToQueue',
      'removeFromQueue': 'removeFromQueue',
      'setState': 'setState'
    },

    setState: function(payload) {
      this.state.set(QUEUES.CLARIFICATION, payload.state[QUEUES.CLARIFICATION]);
      this.state.set(QUEUES.DIRECT_POINT, payload.state[QUEUES.DIRECT_POINT]);
      this.state.set(QUEUES.NEW_POINT, payload.state[QUEUES.NEW_POINT]);

      console.log(this.state);
    },

    addToQueue: function(payload) {
      console.log('adding to queue');
      console.log(payload);
      var oldQueue = this.state.get(payload.queueName);
      oldQueue.push(payload.username);
      this.state.set('currentQueue', payload.queueName);
    },

    removeFromQueue: function(payload) {
      var currentQueueName = this.state.get('currentQueue');
      var oldQueue = this.state.get(currentQueueName);
      this.state.set(currentQueueName, (oldQueue || []).filter(function(name) {
        return name != payload.username;
      }));
    },

    exports: {
      getQueue: function(queueName) {
        return this.state.get(queueName);
      },

      get currentItemName() {
        return this.state.get('currentItemName');
      },

      get currentQueue() {
        return this.state.get('currentQueue');
      }
    }
  };
});
