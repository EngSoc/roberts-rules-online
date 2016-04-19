'use strict';

angular.module('myApp')

.controller('LoginCtrl', function($scope, auth, store) {
  console.log('Login Controller initialized');
  auth.signout();
  store.remove('profile');
  store.remove('token');
  $scope.auth = auth;
  auth.signin();
});
