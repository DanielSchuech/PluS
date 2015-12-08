'use strict';

var component = require('./apiv1.module');

component.service('UserManagementService', UserManagementService);

function UserManagementService($http, $location, $state) {
  this.login = login;
  this.checkLogin = checkLogin;
  this.signup = signup; 
  
  function login(email, pw) {
    var url = '/signin';
    url += '?email=';
    url += email;
    url += '&password='
    url += pw;
    return $http.get(url);
  }
  
  function checkLogin() {
    $http.get('/checklogin').then(loggedIn, redirectToLogin);
    
    function loggedIn() {
      var path = $location.path();
      if (path === '/login') {
        $state.go('home.status');
      }
    }
    
    function redirectToLogin() {
      $state.go('login');
    }
  }
  
  function signup(email,pw) {
    return $http.post('/signup', {
      email: email,
      password: pw
    });
  }
}
