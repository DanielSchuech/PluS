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
    url: '^/home',
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
  })
  .state('home.manage', {
    url: '^/manage',
    views: {
      'content@home': {
          template: require('./manage/manage.cache.html'),
          controller: 'ManageController',
          controllerAs: 'manageCtrl'
      }
    }
  })
  .state('home.plugininfo', {
    url: '^/info/:plugin',
    views: {
      'content@home': {
          template: require('./plugininfo/plugininfo.cache.html'),
          controller: 'PluginInfoController',
          controllerAs: 'pluginInfoCtrl'
      }
    }
  });
}  
  