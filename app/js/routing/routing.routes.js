'use strict';

var component = require('./routing.module');

component.config(Routes);

function Routes($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
    
  $stateProvider
  .state('login', {
    url: '^/login',
    template: require('./login/login.cache.html'),
    controller: 'LoginController',
    controllerAs: 'loginCtrl'
  });
}  
  