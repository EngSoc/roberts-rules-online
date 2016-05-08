angular.module('myApp')

.constant('actions', {
  SET_ITEM_NAME: 'SET_ITEM_NAME'
})
.factory('meetingActions', ['flux', 'actions', 'auth', 'MeetingStore',
    function(flux, actions, auth, MeetingStore) {
  var service = {
    setItemName: setItemName,
    addToQueue: addToQueue,
    removeFromQueue: removeFromQueue,
    setState: setState
  };

  return service;

  function setState(state) {
    flux.dispatch('setState', {
      state: state
    });
  }

  function setItemName(name) {
    flux.dispatch(actions.SET_ITEM_NAME, {
      name: name
    });
  }

  function addToQueue(queueName) {
    flux.dispatch('addToQueue', {
      queueName: queueName,
      username: auth.profile.username
    });
  }

  function removeFromQueue() {
    if (MeetingStore.currentQueue) {
      flux.dispatch('removeFromQueue', {
        username: auth.profile.username
      });
    }
  }
}]);
