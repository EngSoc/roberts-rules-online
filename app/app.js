'use strict';

// Declare app level module which depends on views, and components
angular
  .module('myApp', [
    'ngRoute',
    'flux',
    'btford.socket-io',
    'auth0',
    'angular-storage',
    'angular-jwt'
  ])

  .constant('QUEUES', {
    'NEW_POINT': 'New Point',
    'DIRECT_POINT': 'Direct Point',
    'CLARIFICATION': 'Clarification'
  })

  .factory('mySocket', function(socketFactory) {
    return socketFactory();
  })

  .config(['$routeProvider', 'fluxProvider', 'authProvider', 'jwtInterceptorProvider', '$httpProvider',
      function($routeProvider, fluxProvider, authProvider, jwtInterceptorProvider, $httpProvider) {

    $routeProvider.when('/login', {
      templateUrl: 'login/login.html',
      controller: 'LoginCtrl'
    })
    .when('/meeting', {
      templateUrl: 'meeting/meeting.html',
      controller: 'MeetingCtrl'
    })
    .otherwise({redirectTo: '/meeting'});

    authProvider.init({
      domain: 'engsoc.auth0.com',
      clientID: '8I7eh8UDrzDarVZtwEZSQrwVW1C8NnOF',
      callbackUrl: location.href,
      loginUrl: '/login'
    });

    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');

    authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
      console.log("Login Success");
      profilePromise.then(function(profile) {
        store.set('profile', profile);
        store.set('token', idToken);
      });
      $location.path('/meeting');
    });

    authProvider.on('loginFailure', function() {
       // Error Callback
    });

    fluxProvider.setImmutableDefaults({ immutable: false });
  }])
  .run(function($rootScope, $location, QUEUES, mySocket, auth, store, jwtHelper) {
    $rootScope.QUEUES = QUEUES;
    $rootScope.$on( "$routeChangeStart", function(evt) {
      if(!auth.isAuthenticated) {
        $location.path("/login");
      }
    });

    $rootScope.$on('$locationChangeStart', function() {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        } else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    });

    auth.hookEvents();

    mySocket.on('connection', function(socket) {
      console.log('Connected');
    });

    mySocket.on('message', function(msg) {
      console.log(msg);
    });
  });
