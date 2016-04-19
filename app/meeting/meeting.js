'use strict';

angular.module('myApp')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/meeting', {
    templateUrl: 'meeting/meeting.html',
    controller: 'MeetingCtrl'
  });

}])

.controller('MeetingCtrl', ['$scope', 'MeetingStore', 'auth',
    function($scope, MeetingStore, auth) {
  $scope.$listenTo(MeetingStore, setStoreVars);
  $scope.auth = auth;

  setStoreVars();

  function setStoreVars() {
    $scope.itemName = MeetingStore.currentItemName;
  }
}]);
