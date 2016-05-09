'use strict';

angular.module('myApp')

.directive('column', function() {
  return {
    templateUrl: 'column/column.html',
    scope: {
      header: '@',
      names: '@'
    },
    restrict: 'E',
    controller: 'columnCtrl'
  };
})

.controller('columnCtrl', ['$scope', '$http', '$timeout', 'MeetingStore', 'mySocket', 'meetingActions', 'auth',
    function($scope, $http, $timeout, MeetingStore, mySocket, meetingActions, auth) {

  $scope.addToQueue = addToQueue;
  $scope.names = [];

  $scope.$listenTo(MeetingStore, setStoreVars);

  setStoreVars();

  function setStoreVars() {
    $timeout(function() {
      $scope.names = MeetingStore.getQueue($scope.header);
      console.log($scope.header + ' ' + $scope.names);
    });
  }

  function addToQueue() {
    var data = {
      queue: $scope.header,
      name: auth.profile.username
    };
    if ($scope.names.indexOf(auth.profile.username) > -1) {
      $http.delete('/api/v1/' + data.queue + '/' + data.name)
        .success(function (data, status, headers) {
        })
        .error(function(data,status, header, config) {
        });
    } else {
      meetingActions.addToQueue($scope.header);
      // mySocket.emit('message', $scope.header);
      console.log(auth);
      $http.put('/api/v1/queue', data)
        .success(function (data, status, headers) {
        })
        .error(function(data,status, header, config) {
        });
    }
  }
}]);
