'use strict';

var component = require('./routing.module');

component.config(Routes);

function Routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
    
  $stateProvider
  .state('login', {
    url: '^/login',
    views: {
      "main": { 
        template: require('./login/login.cache.html'),
        controller: 'LoginController',
        controllerAs: 'loginCtrl'
      }
    }
  })
  .state('home', {
    url: '',
    views: {
      "main": { 
        template: require('./home/home.cache.html'),
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      }
    }
  })
  .state('home.status', {
    url: '^/',
    views: {
      'content@home': {
          template: require('./status/status.cache.html'),
          controller: 'StatusController',
          controllerAs: 'statusCtrl'
      }
    }
  });
}  
  