'use strict';

angular.module('myApp')

.directive('column', function() {
  return {
    templateUrl: 'column/column.html',
    scope: {
      header: '@'
    },
    restrict: 'E',
    controller: 'columnCtrl'
  };
})

.controller('columnCtrl', ['$scope', 'MeetingStore', 'mySocket',
    function($scope, MeetingStore, mySocket) {

  $scope.addToQueue = addToQueue;

  $scope.$listenTo(MeetingStore, setStoreVars);

  setStoreVars();

  function setStoreVars() {
    $scope.names = MeetingStore.getQueue($scope.header);
  }

  function addToQueue() {
    mySocket.emit('message', $scope.header);
    console.log('test');
  }
}]);
