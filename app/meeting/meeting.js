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
  $scope.auth = auth;
}]);
